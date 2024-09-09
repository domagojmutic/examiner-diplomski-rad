#!/bin/bash

# Set the base and destination directories
BASE_DIR="$(pwd)/plugins/question_types"
DEST_DIR="$(pwd)/backend/plugins/questions"

# Check if the base directory exists
if [ ! -d "$BASE_DIR" ]; then
  echo "Directory $BASE_DIR does not exist."
  exit 1
fi

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Loop through each directory in the base directory
for dir in "$BASE_DIR"/*/; do
  if [ -d "$dir" ]; then
    echo "Building project in $dir"
    cd "$dir/display" || exit
    npm install
    npm run build

    # Check if the dist directory exists
    if [ -d "dist" ]; then
      # Find the js file with pattern *-question.js
      js_file=$(find dist/assets -name "*-component.js" | head -n 1)
      
      if [ -n "$js_file" ]; then
        # Extract the prefix before the '-' character
        prefix=$(basename "$js_file" | cut -d '-' -f 1)

        # Define the new directory name in the destination
        new_dir="$DEST_DIR/$prefix"
		
		mkdir -p "$new_dir"

        echo "Copying and renaming dist directory from $dir to $new_dir"
        cp -R dist/assets/* "$new_dir"
      else
        echo "No matching JS file found in dist directory of $dir"
      fi

    else
      echo "No dist directory found in $dir"
    fi

	cd "../logic"
	pnpm install
    pnpm build
	if [ -d "build" ]; then
		new_dir="$DEST_DIR/$prefix"
		echo "Copying and renaming dist directory from $dir to $new_dir"
        cp -R build/* "$new_dir"
	else
      echo "No build directory found in $dir"
	fi
	
    cd - || exit
  fi
done

echo "Build, copy, and rename process completed for all projects."
