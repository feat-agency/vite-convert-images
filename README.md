# vite-convert-images
A blazing-fast Vite plugin that automatically converts your raster images into modern formats and responsive variants — with zero hassle.
## ✨ Features
#### 🪄 **Automatic Downscaling**
If you include high-density assets like `image@2x.png` or `image@3x.jpg`, the plugin will:
- Generate scaled variants (`@3x → @2x → @1x`, `@2x → @1x`,  depending on max scale).
- Convert each version to `WebP` and `AVIF` formats.

#### 🖼️ **LQIP (Low Quality Image Placeholder) Generation**
Creates a tiny blurred webp thumbnail perfect for lazy-loading or progressive image effects.

#### ⚡ **Parallel Image Processing**
Handles multiple images in parallel for maximum performance.

#### 🧠 **Zero-config & Easy to Use**

Install, enable, and enjoy optimized images instantly.

![Demo](./demo.gif)

## 📦 Installation
```bash
npm install vite-convert-images --save-dev
```

## Usage
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import viteConvertImages from 'vite-convert-images'

export default defineConfig({
  plugins: [
    viteConvertImages()
  ]
})
```
Now if you save your image in `assets` folder it will generate all the conversions

**❗️Importnat Note**

Images must be named end with `@2x`, `@3x`, `@4x` etc. because the covnersion count depends on this number.

For example
| Input File         | Generated Assets                                         |
| ------------------ | -------------------------------------------------------- |
| `hero@3x.png`      | `hero@3x.webp`, `hero@3x.avif`, `hero@2x.*`, `hero@1x.*` |
| `icon@2x.png`      | `icon@2x.webp`, `icon@2x.avif`, `icon@1x.*`              |



## 🚀 Why Use This?
Modern web performance starts with images. `vite-convert-images` helps you ship smaller, smarter, and future-proof image assets without any manual work.

- **Reduced bundle size** — WebP and AVIF can be 50–80% smaller than PNG/JPEG.
- **Responsive ready** — Automatically generate variants for different screens.
- **Progressive loading UX** — Built-in LQIP means images load gracefully with blur previews.
- **Developer-friendly workflow** — Just drop your assets in and the plugin handles the rest.
- **Optimized for modern browsers** — Seamlessly deliver next-gen formats with fallback support.
