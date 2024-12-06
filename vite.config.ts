import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
// import manifest from './manifest.json' // Node 14 & 16
import manifest from './manifest.json' assert { type: 'json' } // Node >=17
import path from 'path'
import copy from 'rollup-plugin-copy' // 引入 rollup-plugin-copy,

import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

const viteManifestHackIssue846: any = {
  // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
  // https://github.com/crxjs/chrome-extension-tools/issues/846
  name: 'manifestHackIssue846',
  renderCrxManifest(_manifest:any, bundle:any) {
      bundle['manifest.json'] = bundle['.vite/manifest.json']
      bundle['manifest.json'].fileName = 'manifest.json'
      delete bundle['.vite/manifest.json']
  },
}

// https://vite.dev/config/
export default defineConfig({
  root: 'src/',
  plugins: [
    vue(),
    viteManifestHackIssue846,
    crx({ manifest } as any),
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' }, // 复制 manifest.json 到 dist 目录 , 不需要压缩
        { src: "src/icons/**", dest: 'dist/icons' }, // 复制 src/icons/** 到 dist/icons 目录
        { src: 'src/css/**', dest: 'dist/css' }, // 复制 manifest.json 到 dist 目录 , 不需要压缩
      ]
    }),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/index.html'),
        content: path.resolve(__dirname, 'src/content/content.ts'),
        background: path.resolve(__dirname, 'src/background/service-worker.ts'),
        css: path.resolve(__dirname, 'src/css/global.css')
      },
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]', // 静态资源
        chunkFileNames: 'js/[name]-[hash].js', // 代码分割中产生的 chunk,
        entryFileNames: (chunkInfo) => { // 入口文件
          const baseName = path.basename(chunkInfo.facadeModuleId ?? '', path.extname(chunkInfo.facadeModuleId ?? ''))
          const saveArr = ['content', 'service-worker']
          return `[name]/${saveArr.includes(baseName) ? baseName : chunkInfo.name}.js`;
        },
        name: '[name].js'
      }
    }
  }
})
