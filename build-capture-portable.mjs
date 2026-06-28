import { chmod, copyFile, mkdir, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const targetIndex = process.argv.indexOf("--target");
const target = targetIndex >= 0 ? process.argv[targetIndex + 1] : undefined;
const exeExt = process.platform === "win32" ? ".exe" : "";
const releaseDir = target
  ? path.join(root, "src-tauri", "target", target, "release")
  : path.join(root, "src-tauri", "target", "release");
const source = path.join(releaseDir, `seedlog${exeExt}`);
const outputDir = path.join(root, "dist-portable");
const output = path.join(outputDir, `SeedLog-Capture${exeExt}`);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      shell: process.platform === "win32",
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

const tauriArgs = [
  "build",
  "--no-bundle",
  "--config",
  "src-tauri/tauri.capture.conf.json",
];

if (target) {
  tauriArgs.push("--target", target);
}

await run("tauri", tauriArgs);

await stat(source);
await mkdir(outputDir, { recursive: true });
await copyFile(source, output);

if (process.platform !== "win32") {
  await chmod(output, 0o755);
}

console.log(`Portable capture app written to ${path.relative(root, output)}`);
