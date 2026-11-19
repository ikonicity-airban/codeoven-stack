---
name: webgl-threejs-canvas
description: Develop interactive 3D web games, GLTF model viewers, particle systems, and canvas games using Three.js and WebGL.
---

# WebGL & Three.js 3D Web Development Guide

## 1. Scene, Camera, and Animation Loop
Always manage render loops with `requestAnimationFrame` and update clocks:

```ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

## 2. Performance Optimization
- Limit shadow map resolutions and draw calls by merging static geometries.
- Always dispose geometries, textures, and materials when removing models from memory to avoid GPU memory leaks.
