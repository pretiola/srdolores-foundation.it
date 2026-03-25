const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../static/pictures');
const outputDir = path.join(__dirname, '../static/pictures/optimized');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Find all image files matching *_sharpen pattern
const files = fs.readdirSync(inputDir).filter(file => 
    file.endsWith('_sharpen.png') || 
    file.endsWith('_sharpen.jpg') || 
    file.endsWith('_sharpen.jpeg')
);

const sizes = [400, 800, 1200];

async function processImages() {
    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        // Extract the base payload without the _sharpen suffix to mount the final name flawlessly
        const basename = file.replace(/_sharpen\.(png|jpg|jpeg)$/, '');

        console.log(`Processing high-rez source: ${file}...`);

        for (const size of sizes) {
            // Generate modern highly compressed WebP format dynamically
            await sharp(inputPath)
                .resize(size)
                .webp({ quality: 80 })
                .toFile(path.join(outputDir, `${basename}_${size}w.webp`));
            
            // Generate universally compatible JPEG fallback dynamically
            await sharp(inputPath)
                .resize(size)
                .jpeg({ quality: 80 })
                .toFile(path.join(outputDir, `${basename}_${size}w.jpg`));
        }
        console.log(`Successfully compiled 6 optimized variants for ${file} into /static/pictures/optimized/.`);
    }
}

processImages().catch(err => {
    console.error('Fatal error scaling image build automation:', err);
    process.exit(1);
});
