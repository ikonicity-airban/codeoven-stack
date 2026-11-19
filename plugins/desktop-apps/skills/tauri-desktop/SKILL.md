---
name: tauri-desktop
description: Build secure, ultra-lightweight desktop applications using Tauri and Rust with web frontends (React, Vue, Svelte). Use when writing Tauri commands, configuring IPC, or packaging desktop binaries.
---

# Tauri Desktop Architecture Guide

Tauri creates tiny, secure, memory-efficient desktop applications by pairing a **Rust backend** with **OS-native WebViews** (WebView2 on Windows, WebKit on macOS).

## 1. Rust Command Handlers (IPC)
Define commands in `src-tauri/src/lib.rs` and invoke them from frontend:

```rust
// In src-tauri/src/lib.rs
#[tauri::command]
fn read_local_metrics(filepath: String) -> Result<String, String> {
    std::fs::read_to_string(&filepath).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_local_metrics])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 2. Frontend Invocation
```ts
import { invoke } from "@tauri-apps/api/core";

async function loadData() {
  const content = await invoke<string>("read_local_metrics", { filepath: "config.json" });
  console.log(content);
}
```

## 3. Security & Capabilities
- Use Tauri v2 Capabilities ACL to restrict which frontend surfaces can access native filesystem or shell commands.
