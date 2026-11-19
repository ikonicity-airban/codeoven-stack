---
name: threejs-3d-webgl
description: Architect, build, and optimize high-performance 3D web experiences, games, interactive scenes, and custom shaders using Three.js, React Three Fiber (R3F), Drei, Rapier physics, and WebGL/WebGPU.
---

# Three.js, React Three Fiber & WebGL/WebGPU Skill

This skill provides comprehensive architectural patterns, code templates, performance guidelines, and asset optimization workflows for building production-grade 3D web applications and games.

---

## 1. Core Ecosystem Selection

| Paradigm | Library Stack | Best Suited For | Key Advantages |
| :--- | :--- | :--- | :--- |
| **Declarative React** | `@react-three/fiber` (R3F), `@react-three/drei`, `@react-three/rapier`, `@react-three/postprocessing` | Modern Next.js/React web apps, 3D configurators, interactive portfolios | Automatic canvas resize, declarative scene graphs, unmount garbage collection, massive component ecosystem |
| **Imperative Vanilla** | `three`, `three/addons`, `cannon-es` or `rapier3d`, `gsap` | Standalone canvas games, embedded widgets in vanilla/Svelte/Vue | Zero React overhead, direct control over the render loop, lowest memory footprint |
| **Next-Gen WebGPU** | `three/webgpu`, TSL (Three Shading Language), NodeMaterial | High-draw-call scenes, GPU compute particles, progressive 2025+ web platforms | Native compute shader pipelines, multi-threaded command buffers, future-proof |

---

## 2. React Three Fiber (R3F) Production Architecture

### Canvas Setup with Sensible Defaults
```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, AdaptiveDpr, Preload } from '@react-three/drei';
import { Suspense } from 'react';

export function SceneCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-neutral-950">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]} // Clamp max DPR to 2 to prevent GPU thermal throttling on retina displays
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <Suspense fallback={null}>
          <Environment preset="city" />
          {children}
        </Suspense>
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 2} />
        <Preload all />
      </Canvas>
    </div>
  );
}
```

### Loading GLTF/GLB Models Efficiently
Use `useGLTF` with Draco compression and mesh instancing:
```tsx
import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function Model({ url, ...props }: { url: string } & JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Traverse and optimize materials / shadows
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // Enable frustum culling explicitly
        mesh.frustumCulled = true;
      }
    });

    if (actions && actions['Idle']) {
      actions['Idle'].reset().fadeIn(0.5).play();
    }
  }, [scene, actions]);

  return <primitive ref={group} object={scene} {...props} />;
}

// Preload for instant zero-jank mounting
useGLTF.preload('/models/character.glb');
```

---

## 3. High-Performance Instanced Rendering

When rendering hundreds or thousands of similar objects (trees, bullets, stars, debris):
```tsx
import { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

export function AsteroidBelt({ count = 2000 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const radius = 10 + Math.random() * 20;
      const angle = Math.random() * Math.PI * 2;
      dummy.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * radius
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const scale = 0.2 + Math.random() * 0.4;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 1]} />
      <meshStandardMaterial roughness={0.8} metalness={0.2} color="#555555" />
    </instancedMesh>
  );
}
```

---

## 4. Custom GLSL Shaders & Materials

### Custom Shader Material Pattern
```tsx
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const WaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color('#3b82f6'),
    uColorB: new THREE.Color('#ec4899'),
  },
  // Vertex Shader
  /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;
      vec3 pos = position;
      float elevation = sin(pos.x * 3.0 + uTime * 2.0) * 0.2
                      + sin(pos.y * 2.0 + uTime * 1.5) * 0.15;
      pos.z += elevation;
      vElevation = elevation;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  /* glsl */ `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      float mixStrength = (vElevation + 0.2) * 2.5;
      vec3 color = mix(uColorA, uColorB, clamp(mixStrength, 0.0, 1.0));
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ WaveMaterial });

export function HolographicPlane() {
  const matRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uTime += delta;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5, 5, 64, 64]} />
      {/* @ts-ignore */}
      <waveMaterial ref={matRef} wireframe={false} />
    </mesh>
  );
}
```

---

## 5. 3D Physics with `@react-three/rapier`

```tsx
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

export function PhysicsScene() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      {/* Dynamic Falling Cube */}
      <RigidBody restitution={0.7} friction={0.5} colliders="cuboid">
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>
      </RigidBody>

      {/* Static Ground Floor */}
      <RigidBody type="fixed">
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[20, 1, 20]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </RigidBody>
    </Physics>
  );
}
```

---

## 6. Asset Optimization Pipeline

1. **Draco / Meshopt Geometry Compression**:
   Run `npx gltf-transform optimize input.glb output.glb --draco.compress` to reduce file sizes by 70–90%.
2. **KTX2 / Basis Texture Compression**:
   Convert high-res JPEG/PNG textures to KTX2 GPU textures via `gltf-transform uastc input.glb output.glb` for instant GPU VRAM upload without uncompressed decompression spikes.
3. **Strict Memory Management**:
   Always dispose unused geometries, textures, and materials when components unmount in vanilla Three.js:
   ```ts
   geometry.dispose();
   material.dispose();
   if (material.map) material.map.dispose();
   ```
