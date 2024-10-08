/// <reference types="vite/client" />

import styleModule from '@/assets/scss/variables.module.scss';

export const styleLoader = {
  get: (name: string) => {
    return styleModule[name];
  }
}
