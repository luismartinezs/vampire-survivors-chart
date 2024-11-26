#!/bin/bash

# Define the path to your CSS file
CSS_FILE="app/icons.css"

# Extract class names from the CSS file
grep -o '\.icon-[a-zA-Z0-9_-]*' "$CSS_FILE" | sed 's/\.//g' | sort | uniq