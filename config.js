import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: {
    plugins: [
        somePlugin(), // 添加插件
      ],
  },
})