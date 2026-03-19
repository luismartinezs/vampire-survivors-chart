#!/bin/bash

# Check if the directory argument is provided
if [[ -z $1 ]]; then
	echo "Usage: $0 <directory>"
	exit 1
fi

# Directory to search (passed as the first argument)
directory="$1"

# Check if the directory exists
if [[ ! -d $directory ]]; then
	echo "Error: Directory '$directory' does not exist."
	exit 1
fi

# Regex pattern to match filenames (e.g., files starting with "Sprite-")
pattern="^Sprite-"

# Loop through matching files
for file in "$directory"/*; do
	if [[ $(basename "$file") =~ $pattern ]]; then
		# Remove the "Sprite-" prefix
		new_name=$(basename "$file" | sed 's/^Sprite-//')

		# Rename the file
		mv "$file" "$directory/$new_name"
		echo "Renamed: $file -> $directory/$new_name"
	fi
done
