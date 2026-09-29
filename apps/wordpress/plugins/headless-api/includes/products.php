<?php
/**
 * Headless API - Products
 *
 * Registers a Product post type and exposes product fields to WPGraphQL.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'init', function () {
    register_post_type(
        'product',
        [
            'labels' => [
                'name'          => __( 'Products', 'headless-api' ),
                'singular_name' => __( 'Product', 'headless-api' ),
            ],
            'public'             => true,
            'show_in_rest'       => true,
            'menu_icon'          => 'dashicons-cart',
            'supports'           => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
            'has_archive'        => true,
            'rewrite'            => [ 'slug' => 'products' ],
            'show_in_graphql'    => true,
            'graphql_single_name'=> 'Product',
            'graphql_plural_name'=> 'Products',
        ]
    );

    register_post_meta(
        'product',
        'price',
        [
            'type'              => 'string',
            'single'            => true,
            'default'           => '',
            'show_in_rest'      => true,
            'sanitize_callback' => 'sanitize_text_field',
        ]
    );
} );

add_action( 'graphql_register_types', function () {
    register_graphql_field(
        'Product',
        'price',
        [
            'type'        => 'String',
            'description' => __( 'Product price.', 'headless-api' ),
            'resolve'     => static function ( $product ) {
                return get_post_meta( $product->ID, 'price', true );
            },
        ]
    );

    register_graphql_field(
        'Product',
        'featuredImageUrl',
        [
            'type'        => 'String',
            'description' => __( 'Featured image URL.', 'headless-api' ),
            'resolve'     => static function ( $product ) {
                return get_the_post_thumbnail_url( $product->ID, 'large' ) ?: null;
            },
        ]
    );
} );
