#!/bin/bash

# Set the base and destination directories
BASE_DIR="$(pwd)/sheet-scanner"
DEST_DIR="$(pwd)/backend/scanner-frontend"

# Check if the base directory exists
if [ ! -d "$BASE_DIR" ]; then
  echo "Directory $BASE_DIR does not exist."
  exit 1
fi

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

rm -rf "$DEST_DIR"/*

echo "Building project in $BASE_DIR"
cd "$BASE_DIR" || exit
pnpm install
pnpm build

echo "Copying and renaming dist directory from $dir to $DEST_DIR"
cp -R dist "$DEST_DIR"

cd - || exit

echo "Build and copy process completed for html-pdf-display."