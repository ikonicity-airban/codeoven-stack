---
name: photo-editing-automation
description: Automate photo editing, background removal, smart cropping, color grading, and format optimization using Sharp, rembg, Canvas, and ImageMagick.
---

# Programmatic Photo Editing & Background Removal

Guide for editing raster photos, removing backgrounds, and automating asset pipelines using code.

## 1. Background Removal Techniques
- **AI Background Removal (Python rembg / ONNX / WebAssembly):**
  Uses deep learning models (u2net / bria-rmbg) to produce clean alpha cutouts of subjects:
  ```python
  from rembg import remove
  from PIL import Image

  input_image = Image.open("portrait.jpg")
  output_image = remove(input_image)
  output_image.save("portrait_cutout.png")
  ```
- **Client-Side / Node.js with Canvas & Sharp:**
  - Color-keying / chroma-keying for solid backgrounds.
  - Applying edge blur and feathering to alpha borders to eliminate halos.

## 2. High-Speed Image Processing with Sharp (Node.js)
```ts
import sharp from "sharp";

// Crop, apply duotone/color grade, and convert to WebP
await sharp("input.jpg")
  .resize(1200, 800, { fit: "cover", position: "attention" }) // Smart focal point detection
  .modulate({ brightness: 1.05, saturation: 1.2 })
  .webp({ quality: 85 })
  .toFile("output.webp");
```
