#!/bin/bash

# Generate responsive images in multiple formats
# This script converts images to WebP and AVIF formats for better performance

echo "🖼️  Generating responsive images..."

# Check if sharp-cli is installed
if ! command -v sharp &> /dev/null; then
    echo "⚠️  sharp-cli not found. Install with: npm install -g sharp-cli"
    echo "Skipping image optimization..."
    exit 0
fi

# Navigate to img directory
cd "$(dirname "$0")/../img" || exit 1

# Convert PNG images to WebP
for img in *.png; do
    if [ -f "$img" ]; then
        filename="${img%.*}"
        echo "  → Converting $img to WebP..."
        sharp -i "$img" -o "${filename}.webp" --webp
        
        echo "  → Converting $img to AVIF..."
        sharp -i "$img" -o "${filename}.avif" --avif
    fi
done

# Convert JPG/JPEG images to WebP
for img in *.jpg *.jpeg; do
    if [ -f "$img" ]; then
        filename="${img%.*}"
        echo "  → Converting $img to WebP..."
        sharp -i "$img" -o "${filename}.webp" --webp
        
        echo "  → Converting $img to AVIF..."
        sharp -i "$img" -o "${filename}.avif" --avif
    fi
done

echo "✓ Image optimization complete!"
