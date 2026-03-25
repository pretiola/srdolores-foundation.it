const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../static/pictures');
const outputDir = path.join(__dirname, '../static/pictures/optimized');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Find all image files, skipping optimized/, backups (*~), and *.orig.* files
const allFiles = fs.readdirSync(inputDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) return false;
    if (file.endsWith('~')) return false;
    if (file.includes('.orig.')) return false;
    return true;
});

// Build a map: basename -> source file path
// If a _sharpen variant exists, prefer it as the high-res source
const sourceMap = new Map();

for (const file of allFiles) {
    const ext = path.extname(file);
    const nameWithoutExt = path.basename(file, ext);
    const sharpenMatch = nameWithoutExt.match(/^(.+)_sharpen$/);

    if (sharpenMatch) {
        // _sharpen file: use as source for the base name
        const basename = sharpenMatch[1];
        sourceMap.set(basename, { file, path: path.join(inputDir, file) });
    } else if (!sourceMap.has(nameWithoutExt)) {
        // Regular file: only use if no _sharpen variant already registered
        sourceMap.set(nameWithoutExt, { file, path: path.join(inputDir, file) });
    }
}

const sizes = [400, 800, 1200];

async function processImages() {
    for (const [basename, source] of sourceMap) {
        console.log(`Processing: ${source.file} -> ${basename}`);

        for (const size of sizes) {
            await sharp(source.path)
                .resize(size)
                .webp({ quality: 80 })
                .toFile(path.join(outputDir, `${basename}_${size}w.webp`));

            await sharp(source.path)
                .resize(size)
                .jpeg({ quality: 80 })
                .toFile(path.join(outputDir, `${basename}_${size}w.jpg`));
        }
        console.log(`  -> Generated 6 variants for ${basename}`);
    }
    console.log(`\nDone. Processed ${sourceMap.size} images.`);
}

processImages().catch(err => {
    console.error('Fatal error in image optimization:', err);
    process.exit(1);
});
