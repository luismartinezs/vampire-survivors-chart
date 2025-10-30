#!/bin/bash

# Generate all CSS files for Balatro DLC from WebP images
# Processes the entire directory structure and creates corresponding CSS files

SOURCE_BASE="context/tickets/balatro-dlc/new-items"
STYLES_BASE="styles"

if [ ! -d "$SOURCE_BASE" ]; then
    echo "Error: Source directory $SOURCE_BASE does not exist"
    exit 1
fi

echo "🎯 Generating Balatro DLC CSS files..."
echo "Source: $SOURCE_BASE"
echo "Target: $STYLES_BASE"
echo ""

total_processed=0

# Process each DLC directory (ante, base, otc)
for dlc_dir in "$SOURCE_BASE"/*; do
    if [ ! -d "$dlc_dir" ]; then
        continue
    fi
    
    dlc_name=$(basename "$dlc_dir")
    echo "📁 Processing DLC: $dlc_name"
    
    # Process each category within the DLC (evolutions, passives, weapons, unions)
    for category_dir in "$dlc_dir"/*; do
        if [ ! -d "$category_dir" ]; then
            continue
        fi
        
        category_name=$(basename "$category_dir")
        
        # Count WebP files in this category
        webp_count=$(find "$category_dir" -name "*.webp" | wc -l)
        
        if [ "$webp_count" -eq 0 ]; then
            echo "  ⚠️  Skipping $dlc_name/$category_name (no WebP files found)"
            continue
        fi
        
        # Define output CSS file
        output_css="$STYLES_BASE/$dlc_name/$category_name.css"
        
        echo "  🔧 $dlc_name/$category_name.css ($webp_count icons)"
        
        # Generate CSS for this category
        ./scripts/gen-icons-webp.sh "$category_dir" "$output_css"
        
        ((total_processed += webp_count))
    done
    
    echo ""
done

echo "🎉 Complete! Generated CSS files for $total_processed total icons"
echo ""
echo "📂 Generated structure:"
find "$STYLES_BASE" -name "*.css" -path "*/ante/*" -o -path "*/base/*" -o -path "*/otc/*" | sort