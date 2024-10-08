import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import {sentryVitePlugin} from '@sentry/vite-plugin'

const uploadSourceMap: string = '${DOCKER.UPLOAD_SOURCE_MAP}'
let sentryPlugin: any = []
if(uploadSourceMap === 'on') {
    sentryPlugin = sentryVitePlugin({
        org: "test-inc",
        project: "side-front-init",
        // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
        // and need `project:releases` and `org:read` scopes
        authToken: '',
        release: {name: '${DOCKER.COMMIT_NUM}'},
    })
}

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    const envDir = "env"
    process.env = Object.assign(process.env, loadEnv(mode, process.cwd() + `/${envDir}`, ''));
    return {
        plugins: [vue(), vueJsx(), VueDevTools(), sentryPlugin],
        envDir,
        server: {
            proxy: {
                '/upload/asset': {
                    target: process.env.VITE_ASSET_SERVER,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/\/upload(\/asset|\/assets)/g, ''),
                }
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import './src/assets/scss/variables.scss';
           @import './src/assets/scss/mixins.scss';
          `
                }
            }
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@commons': fileURLToPath(new URL('../commons/src', import.meta.url))
            }
        },
        build: {
            sourcemap: "hidden"
        },
    }
})
