/// <reference types="vite/client" />

import styleModule from '@/assets/scss/variables.module.scss';
const svgFiles = import.meta.glob('../assets/img/*.svg')
export const styleLoader = {
  get: (name: string) => {
    return styleModule[name];
  }
}

export const commonSvgLoader = {
  get: async (path: string) => {
    if (svgFiles[path]) {
      return await svgFiles[path]();
    }
  }
}
