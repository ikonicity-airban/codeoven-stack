---
name: bash-powershell-scripting
description: Write robust, defensive shell scripts in Bash and PowerShell with proper error trapping, arguments parsing, and cross-platform compatibility.
---

# Defensive Shell Scripting Guide

## 1. Defensive Bash Standard
Always start bash scripts with strict mode:
```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
```

## 2. PowerShell Scripting Best Practices
Use `[CmdletBinding()]` and typed `param()` blocks:
```powershell
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)]
    [string]$TargetDirectory,
    [switch]$Force
)
$ErrorActionPreference = "Stop"
```
