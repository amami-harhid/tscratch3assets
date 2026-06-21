/**
 * このファイルの内容を変更してはいけません。
 */
import { resolve } from 'path'
import { defineConfig } from 'vite'

// ルートとするディレクトリー
const root = resolve(__dirname, './src/')

// ビルド結果を出力する先
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
    build: {
        target: "esnext",
        outDir, // ビルド結果を格納する先
        rollupOptions: {
            input: resolve(root, 'index.html'),
        },
    },
    esbuild: {
        supported: {
            'top-level-await': true
        },
        target: "esnext",

    },
    optimizeDeps:{
        esbuildOptions: {
            target: "esnext",
        }
    },
    root: resolve(__dirname, './src'),
})