#!/bin/bash

# Check if a file path argument was provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide the path to a CSS file"
    echo "Usage: $0 <path-to-css-file>"
    exit 1
fi

# Get the CSS file path from command line argument
CSS_FILE="$1"

# Check if the file exists
if [ ! -f "$CSS_FILE" ]; then
    echo "Error: File '$CSS_FILE' does not exist"
    exit 1
fi

# Extract class names from the CSS file
grep -o '\.icon-[a-zA-Z0-9_-]*' "$CSS_FILE" | sed 's/\.//g' | sort | uniq