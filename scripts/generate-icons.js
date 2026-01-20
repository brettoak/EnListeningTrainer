
import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE = path.join(__dirname, '../public/logo.png');
const DEST_DIR = path.join(__dirname, '../public/icon.iconset');

if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

const sizes = [
    { name: 'icon_16x16.png', size: 16 },
    { name: 'icon_16x16@2x.png', size: 32 },
    { name: 'icon_32x32.png', size: 32 },
    { name: 'icon_32x32@2x.png', size: 64 },
    { name: 'icon_128x128.png', size: 128 },
    { name: 'icon_128x128@2x.png', size: 256 },
    { name: 'icon_256x256.png', size: 256 },
    { name: 'icon_256x256@2x.png', size: 512 },
    { name: 'icon_512x512.png', size: 512 },
    { name: 'icon_512x512@2x.png', size: 1024 },
];

const PADDING_FACTOR = 0.8; // Image will be 80% of the total size (10% padding on each side)

async function generate() {
    console.log('Loading source image...');
    const image = await Jimp.read(SOURCE);

    for (const { name, size } of sizes) {
        console.log(`Generating ${name} (${size}x${size})...`);

        // Create a white canvas
        const canvas = new Jimp({ width: size, height: size, color: 0xffffffff }); // White background

        // Resize source image
        const iconContent = image.clone();
        const contentSize = Math.round(size * PADDING_FACTOR);
        iconContent.resize({ w: contentSize, h: contentSize });

        // Composite content onto canvas (centered)
        const offset = Math.round((size - contentSize) / 2);
        canvas.composite(iconContent, offset, offset);

        // Create a mask
        const mask = new Jimp({ width: size, height: size, color: 0x00000000 });

        // Configurable radius. Apple uses approx 22.3% of icon size.
        const radius = Math.round(size * 0.223);

        paintRoundedRect(mask, 0, 0, size, size, radius);

        // Apply mask
        canvas.mask(mask, 0, 0);

        await canvas.write(path.join(DEST_DIR, name));
    }
    console.log('Done!');
}

function paintRoundedRect(image, x, y, w, h, r) {
    // Fill the center areas
    // Rect(x, y+r, w, h-2r)
    image.scan(x, y + r, w, h - 2 * r, (lx, ly, idx) => {
        image.bitmap.data[idx + 0] = 255; // R
        image.bitmap.data[idx + 1] = 255; // G
        image.bitmap.data[idx + 2] = 255; // B
        image.bitmap.data[idx + 3] = 255; // A
    });
    // Rect(x+r, y, w-2r, r)
    image.scan(x + r, y, w - 2 * r, r, (lx, ly, idx) => {
        image.bitmap.data[idx + 0] = 255;
        image.bitmap.data[idx + 1] = 255;
        image.bitmap.data[idx + 2] = 255;
        image.bitmap.data[idx + 3] = 255;
    });
    // Rect(x+r, y+h-r, w-2r, r)
    image.scan(x + r, y + h - r, w - 2 * r, r, (lx, ly, idx) => {
        image.bitmap.data[idx + 0] = 255;
        image.bitmap.data[idx + 1] = 255;
        image.bitmap.data[idx + 2] = 255;
        image.bitmap.data[idx + 3] = 255;
    });

    // Draw 4 corners
    drawCorner(image, x + r, y + r, r, true, true);     // Top-Left
    drawCorner(image, x + w - r - 1, y + r, r, false, true); // Top-Right
    drawCorner(image, x + w - r - 1, y + h - r - 1, r, false, false); // Bottom-Right
    drawCorner(image, x + r, y + h - r - 1, r, true, false);  // Bottom-Left
}

// Function to draw filled circle quadrant
function drawCorner(image, cx, cy, r, isLeft, isTop) {
    // Simple scan of the bounding box of the corner
    const startX = isLeft ? cx - r : cx;
    const startY = isTop ? cy - r : cy;

    for (let y = 0; y <= r; y++) {
        for (let x = 0; x <= r; x++) {
            // Check distance
            if (x * x + y * y <= r * r) {
                // Pixel relative to center
                // If isLeft is true, we go left from cx (so cx - x)
                // If isTop is true, we go up from cy (so cy - y)
                // But the loop is running 0..r, which is distance from center.
                // We need to map to grid.

                let px = isLeft ? cx - x : cx + x;
                let py = isTop ? cy - y : cy + y;

                // Boundaries check just in case
                if (px >= 0 && px < image.bitmap.width && py >= 0 && py < image.bitmap.height) {
                    const idx = image.getPixelIndex(px, py);
                    image.bitmap.data[idx + 0] = 255;
                    image.bitmap.data[idx + 1] = 255;
                    image.bitmap.data[idx + 2] = 255;
                    image.bitmap.data[idx + 3] = 255;
                }
            }
        }
    }
}

generate().catch(console.error);
