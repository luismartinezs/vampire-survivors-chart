#!/bin/bash

# Generate CSS icons from WebP images with automatic directory structure creation
# Usage: ./scripts/gen-icons-webp.sh <source_directory> <output_file>

if [ $# -ne 2 ]; then
    echo "Usage: $0 <source_directory> <output_file>"
    echo "Example: $0 context/tickets/balatro-dlc/new-items/ante/weapons styles/ante/weapons.css"
    exit 1
fi

SOURCE_DIR="$1"
OUTPUT_FILE="$2"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Directory $SOURCE_DIR does not exist"
    exit 1
fi

# Create output directory if it doesn't exist
OUTPUT_DIR=$(dirname "$OUTPUT_FILE")
mkdir -p "$OUTPUT_DIR"

# Clear or create the output file
> "$OUTPUT_FILE"

echo "Generating CSS from WebP images in $SOURCE_DIR..."
processed_count=0

# Process each webp file in the directory
for image in "$SOURCE_DIR"/*.webp; do
    # Skip if no files found
    [ -e "$image" ] || continue
    
    # Get the filename without extension and directory
    filename=$(basename "$image" .webp)
    
    # Remove "Sprite-" prefix if present
    filename=$(echo "$filename" | sed 's/^Sprite-//')
    
    # Convert filename to valid CSS class name by:
    # 1. Converting spaces to underscores
    # 2. Removing special characters except hyphens and underscores
    css_classname=$(echo "$filename" | sed 's/ /_/g' | sed 's/[^a-zA-Z0-9_-]//g')
    
    # Convert image to base64
    base64_data=$(base64 -w 0 "$image")
    
    # Append the CSS class to the output file
    echo ".icon-$css_classname { background-image: url('data:image/webp;base64,$base64_data'); }" >> "$OUTPUT_FILE"
    
    ((processed_count++))
done

echo "✓ CSS file generated at $OUTPUT_FILE ($processed_count icons processed)"