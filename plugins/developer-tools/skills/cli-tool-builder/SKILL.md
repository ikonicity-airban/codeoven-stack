---
name: cli-tool-builder
description: Build interactive, developer-friendly command-line tools using Node.js (Commander, Clack, Inquirer), Python (Click, Typer), or Rust (Clap).
---

# CLI Tool Architecture Guide

## 1. Node.js Interactive CLI (Commander + @clack/prompts)
```ts
import { intro, outro, text, select, spinner } from "@clack/prompts";
import { program } from "commander";

intro("Project Scaffolder");

const projectName = await text({
  message: "What is your project name?",
  placeholder: "my-app",
  validate: (value) => (!value ? "Project name is required" : undefined),
});

const s = spinner();
s.start("Generating files...");
// perform scaffolding logic
s.stop("Files created successfully!");

outro("All done! Happy coding.");
```
