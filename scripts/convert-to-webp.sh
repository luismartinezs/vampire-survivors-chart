#!/bin/bash

# Script to convert all PNG files to WebP non-destructively
# Usage: ./scripts/convert-to-webp.sh <source_directory>

if [ $# -ne 1 ]; then
    echo "Usage: $0 <source_directory>"
    echo "Example: $0 context/tickets/balatro-dlc/new-items"
    exit 1
fi

SOURCE_DIR="$1"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Directory $SOURCE_DIR does not exist"
    exit 1
fi

# Check if cwebp is available
if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp is not installed. Please install webp tools:"
    echo "  Ubuntu/Debian: sudo apt install webp"
    echo "  macOS: brew install webp"
    exit 1
fi

echo "Converting PNG files to WebP in $SOURCE_DIR..."
converted_count=0

# Find all PNG files and convert them
find "$SOURCE_DIR" -name "*.png" -type f | while read -r png_file; do
    # Get the directory and filename without extension
    dir=$(dirname "$png_file")
    filename=$(basename "$png_file" .png)
    
    # Target WebP file
    webp_file="$dir/$filename.webp"
    
    # Skip if WebP already exists
    if [ -f "$webp_file" ]; then
        echo "  Skipping $png_file (WebP already exists)"
        continue
    fi
    
    # Trim transparent pixels and convert to WebP with good quality
    trimmed_png=$(mktemp --suffix=.png)
    if convert "$png_file" -trim +repage "$trimmed_png" && cwebp -q 90 "$trimmed_png" -o "$webp_file" &> /dev/null; then
        rm "$trimmed_png"
        echo "  ✓ Converted: $(basename "$png_file") → $(basename "$webp_file")"
        ((converted_count++))
    else
        rm -f "$trimmed_png"
        echo "  ✗ Failed to convert: $png_file"
    fi
done

echo "Conversion complete! Converted $converted_count PNG files to WebP."