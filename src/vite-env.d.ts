/// <reference types="vite/client" />
/// <reference types="chrome-types/index" />

// 解决引入组件报错
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
