<?php
/**
 * Headless API - Products
 *
 * Registers a Product post type and exposes product fields to WPGraphQL.
 */

defined( 'ABSPATH' ) || exit;

add_action(
    'init',
    static function (): void {
        register_post_type(
            'product',
            [
                'labels' => [
                    'name'          => __( 'Products', 'headless-api' ),
                    'singular_name' => __( 'Product', 'headless-api' ),
                ],
                'public'              => true,
                'show_in_rest'        => true,
                'menu_icon'           => 'dashicons-cart',
                'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
                'has_archive'         => true,
                'rewrite'             => [ 'slug' => 'products' ],
                'show_in_graphql'     => true,
                'graphql_single_name' => 'Product',
                'graphql_plural_name' => 'Products',
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
    ]
);

add_action(
    'add_meta_boxes',
    static function (): void {
        add_meta_box(
            'headless_product_details',
            __( 'Product Details', 'headless-api' ),
            static function ( WP_Post $post ): void {
                wp_nonce_field( 'headless_product_details', 'headless_product_details_nonce' );
                $price = get_post_meta( $post->ID, 'price', true );
                ?>
                <p>
                    <label for="headless_product_price">
                        <?php esc_html_e( 'Price', 'headless-api' ); ?>
                    </label>
                </p>
                <input
                    type="text"
                    id="headless_product_price"
                    name="headless_product_price"
                    value="<?php echo esc_attr( $price ); ?>"
                    class="widefat"
                    placeholder="99.00 USD"
                />
                <?php
            },
            'product',
            'side',
            'default'
        );
    }
);

add_action(
    'save_post_product',
    static function ( int $post_id ): void {
        if (
            ! isset( $_POST['headless_product_details_nonce'] ) ||
            ! wp_verify_nonce(
                sanitize_text_field( wp_unslash( $_POST['headless_product_details_nonce'] ) ),
                'headless_product_details'
            )
        ) {
            return;
        }

        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }

        $price = isset( $_POST['headless_product_price'] )
            ? sanitize_text_field( wp_unslash( $_POST['headless_product_price'] ) )
            : '';

        update_post_meta( $post_id, 'price', $price );
    }
);

add_action(
    'graphql_register_types',
    static function (): void {
        register_graphql_field(
            'Product',
            'price',
            [
                'type'        => 'String',
                'description' => __( 'Product price.', 'headless-api' ),
                'resolve'     => static function ( $product ): string {
                    return (string) get_post_meta( $product->ID, 'price', true );
                },
            ]
        );

        register_graphql_field(
            'Product',
            'featuredImageUrl',
            [
                'type'        => 'String',
                'description' => __( 'Featured image URL.', 'headless-api' ),
                'resolve'     => static function ( $product ): ?string {
                    $url = get_the_post_thumbnail_url( $product->ID, 'large' );

                    return $url ? (string) $url : null;
                },
            ]
        );
    }
);
