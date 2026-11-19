---
name: godot-engine
description: Design and develop 2D and 3D games in Godot Engine using GDScript. Use when implementing character controllers, node hierarchies, signals, physics systems, and state machines.
---

# Godot Engine (GDScript) Architecture Guide

## 1. Node Hierarchy & Composition
- **Compose over inherit:** Prefer small reusable scenes attached as child nodes rather than deep inheritance trees.
- **Signal pattern:** Connect signals up, call methods down. Child nodes emit signals when events occur; parent nodes handle game logic.

## 2. 2D / 3D Character Controller Pattern
```gdscript
extends CharacterBody2D

const SPEED = 300.0
const JUMP_VELOCITY = -400.0

@export var gravity: float = 980.0

func _physics_process(delta: float) -> void:
    if not is_on_floor():
        velocity.y += gravity * delta

    if Input.is_action_just_pressed("ui_accept") and is_on_floor():
        velocity.y = JUMP_VELOCITY

    var direction := Input.get_axis("ui_left", "ui_right")
    if direction:
        velocity.x = direction * SPEED
    else:
        velocity.x = move_toward(velocity.x, 0, SPEED)

    move_and_slide()
```
