<?php
/**
 * Plugin Name: Koryla
 * Plugin URI:  https://koryla.com
 * Description: Edge-based A/B testing for WordPress — zero JS, zero flicker.
 * Version:     1.0.0
 * Author:      Koryla
 * Author URI:  https://koryla.com
 * License:     GPL2
 */

if (!defined('ABSPATH')) exit;

define('KORYLA_VERSION',       '1.0.0');
define('KORYLA_PLUGIN_DIR',    plugin_dir_path(__FILE__));
define('KORYLA_API_BASE',      'https://koryla.com');
define('KORYLA_COOKIE_PREFIX', 'ky_');
define('KORYLA_CACHE_EXPIRY',  300); // 5 minutes

// ── Admin settings page ───────────────────────────────────────────────────────

add_action('admin_menu', function () {
    add_menu_page('Koryla', 'Koryla', 'manage_options', 'koryla', 'koryla_settings_page', 'dashicons-randomize', 80);
});

function koryla_settings_page() {
    if (isset($_POST['koryla_api_key'])) {
        check_admin_referer('koryla_save_settings');
        update_option('koryla_api_key', sanitize_text_field($_POST['koryla_api_key']));
        echo '<div class="notice notice-success"><p>Settings saved.</p></div>';
    }

    $api_key     = get_option('koryla_api_key', '');
    $experiments = koryla_get_experiments();
    ?>
    <div class="wrap">
        <h1>Koryla — A/B Testing</h1>
        <form method="post">
            <?php wp_nonce_field('koryla_save_settings'); ?>
            <table class="form-table">
                <tr>
                    <th>API Key</th>
                    <td>
                        <input type="text" name="koryla_api_key"
                               value="<?php echo esc_attr($api_key); ?>"
                               class="regular-text" placeholder="sk_live_..." />
                        <p class="description">
                            Find your key in <a href="<?php echo KORYLA_API_BASE; ?>/dashboard" target="_blank">
                            Koryla Dashboard → Settings → API Keys</a>
                        </p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save Settings'); ?>
        </form>

        <?php if (!empty($experiments)): ?>
        <h2>Active Experiments</h2>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr><th>Name</th><th>Base URL</th><th>Variants</th></tr>
            </thead>
            <tbody>
            <?php foreach ($experiments as $exp): ?>
                <tr>
                    <td><?php echo esc_html($exp['name']); ?></td>
                    <td><code><?php echo esc_html($exp['base_url']); ?></code></td>
                    <td><?php echo count($exp['variants']); ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <?php elseif (!empty($api_key)): ?>
            <p style="margin-top:16px;color:#666">
                No active experiments found.
                <a href="<?php echo KORYLA_API_BASE; ?>/dashboard" target="_blank">Create one in your dashboard →</a>
            </p>
        <?php endif; ?>
    </div>
    <?php
}

// ── Fetch experiments from Koryla API (cached with WP transients) ─────────────

function koryla_get_experiments(): array {
    $cached = get_transient('koryla_experiments');
    if ($cached !== false) return $cached;

    $api_key = get_option('koryla_api_key', '');
    if (empty($api_key)) return [];

    $response = wp_remote_get(KORYLA_API_BASE . '/api/worker/config', [
        'headers' => ['Authorization' => 'Bearer ' . $api_key],
        'timeout' => 5,
    ]);

    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        return [];
    }

    // API returns a flat JSON array of experiments — not a wrapper object
    $experiments = json_decode(wp_remote_retrieve_body($response), true);
    if (!is_array($experiments)) return [];

    set_transient('koryla_experiments', $experiments, KORYLA_CACHE_EXPIRY);
    return $experiments;
}

// ── Traffic splitting via template_redirect ───────────────────────────────────

add_action('template_redirect', function () {
    $experiments = koryla_get_experiments();
    if (empty($experiments)) return;

    $current_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    foreach ($experiments as $exp) {
        if (empty($exp['variants'])) continue;

        $base_path = parse_url($exp['base_url'], PHP_URL_PATH);
        if (strpos($current_path, $base_path) !== 0) continue;

        $cookie_name = KORYLA_COOKIE_PREFIX . $exp['id'];
        $variant_id  = $_COOKIE[$cookie_name] ?? null;

        // Validate stored variant still exists in the experiment
        $valid = $variant_id && !empty(array_filter($exp['variants'], fn($v) => $v['id'] === $variant_id));

        if (!$valid) {
            $variant_id = koryla_assign_variant($exp['variants']);
            setcookie($cookie_name, $variant_id, [
                'expires'  => time() + 2592000, // 30 days
                'path'     => '/',
                'secure'   => true,
                'httponly' => false, // readable by edge functions
                'samesite' => 'Lax',
            ]);
            $_COOKIE[$cookie_name] = $variant_id;
        }

        $variant = null;
        foreach ($exp['variants'] as $v) {
            if ($v['id'] === $variant_id) { $variant = $v; break; }
        }

        // Control variant — serve as-is, no redirect
        if (!$variant || !empty($variant['is_control'])) return;

        $target = parse_url($variant['target_url'], PHP_URL_PATH);
        if ($target && $target !== $current_path) {
            wp_redirect($target, 302);
            exit;
        }

        return; // matched this experiment — stop checking others
    }
});

// ── Weighted random variant assignment ────────────────────────────────────────

function koryla_assign_variant(array $variants): string {
    $total = array_sum(array_column($variants, 'traffic_weight'));
    if ($total <= 0) return $variants[0]['id'];

    $rand       = mt_rand(1, max(1, $total));
    $cumulative = 0;
    foreach ($variants as $v) {
        $cumulative += $v['traffic_weight'];
        if ($rand <= $cumulative) return $v['id'];
    }
    return $variants[count($variants) - 1]['id'];
}
