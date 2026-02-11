const fs = require("fs-extra");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
const publicDir = path.join(__dirname, "..", "..", "public");

// Files/folders to clean up in public directory (but not robots.txt)
const filesToClean = [
  "index.html",
  "static",
  "asset-manifest.json",
  "manifest.json",
  "favicon.ico",
];

console.log("Cleaning previous build from public directory...");
filesToClean.forEach((file) => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    fs.removeSync(filePath);
    console.log(`  Removed: ${file}`);
  }
});

console.log("\nCopying new build to public directory...");
fs.copySync(buildDir, publicDir, {
  overwrite: true,
  filter: (src) => {
    // Don't copy the build directory itself, just its contents
    return true;
  },
});

console.log(
  "[SUCCESS] Build files successfully copied to Rails public directory!",
);
