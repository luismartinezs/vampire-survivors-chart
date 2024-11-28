#!/bin/bash

# Check if a directory argument was provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

# Directory containing the images
IMAGE_DIR="$1"

# Output CSS file
OUTPUT_FILE="tmp/icons.css"

# Create or clear the output file
# echo ".icon { width: 1em; height: 1em; background-position: center; background-size: contain; background-repeat: no-repeat; }" > "$OUTPUT_FILE"

# Process each png file in the directory
for image in "$IMAGE_DIR"/*.png; do
    # Skip if no files found
    [ -e "$image" ] || continue

    # Get the filename without extension and directory
    filename=$(basename "$image" .png)

    # Convert filename to valid CSS class name by:
    # 1. Converting spaces to underscores
    # 2. Removing special characters
    css_classname=$(echo "$filename" | sed 's/ /_/g' | sed 's/[^a-zA-Z0-9_]//g')

    # Convert image to base64
    base64_data=$(base64 -w 0 "$image")

    # Append the CSS class to the output file
    echo ".icon-$css_classname { background-image: url('data:image/png;base64,$base64_data'); }" >> "$OUTPUT_FILE"
done

echo "CSS file generated at $OUTPUT_FILE"