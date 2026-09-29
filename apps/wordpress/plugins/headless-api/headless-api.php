<?php
/**
 * Plugin Name: Headless API
 * Description: Small integration layer for the Next.js headless frontend.
 * Version: 0.1.0
 * Requires PHP: 8.1
 */

defined('ABSPATH') || exit;

add_action('rest_api_init', static function (): void {
    register_rest_route('headless/v1', '/health', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => static function (): array {
            return [
                'ok'      => true,
                'service' => 'wordpress',
            ];
        },
    ]);
});
