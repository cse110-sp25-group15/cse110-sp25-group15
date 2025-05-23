import heic2any from 'https://cdn.skypack.dev/heic2any';
import imageCompression from 'https://cdn.skypack.dev/browser-image-compression';

async function convertImageToWebP(file) {
    if (!file) throw new Error("No file provided");

    const fileType = file.type;
    let convertedBlob;

    try {
        if (fileType === 'image/heic' || file.name.endsWith('.heic')) {
            // Convert HEIC to WebP
            convertedBlob = await heic2any({
                blob: file,
                toType: 'image/webp',
                quality: 0.8,
            });
        } else {
            // Compress and convert other types (JPEG, PNG) to WebP
            convertedBlob = await imageCompression(file, {
                maxSizeMB: 1, // Try to compress image to under 1 MB
                maxWidthOrHeight: 800, // Resize image if it's larger in width/height
                fileType: 'image/webp', // Convert to WebP
            });
        }

        // ConvertedBlob is a WebP image 
        return convertedBlob;

    } catch (err) {
        console.error('Conversion failed:', err);
        throw err;
    }
}