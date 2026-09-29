<?php
/**
 * Plugin Name: Headless API
 * Description: Custom API and content model for the Next.js headless frontend.
 * Version: 0.2.0
 * Requires PHP: 8.1
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/includes/products.php';

add_action(
    'rest_api_init',
    static function (): void {
        register_rest_route(
            'headless/v1',
            '/health',
            [
                'methods'             => 'GET',
                'permission_callback' => '__return_true',
                'callback'            => static function (): array {
                    return [
                        'ok'      => true,
                        'service' => 'wordpress',
                    ];
                },
            ]
        );
    }
);
