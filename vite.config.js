import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/dashxe.css',
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/three.js',
                'resources/css/filament/admin/theme.css',
            ],
            refresh: true,
        }),
    ],
    content: [
        './resources/css/custom.css',
    ],
});
