#!/bin/bash

echo "Paste JSON and press Ctrl+D:"
echo "----------------------------"

cat > temp_json_input.txt

file_name=$(grep '"fileName":' temp_json_input.txt | sed 's/.*": "//;s/".*//')

sed -n '/"content": "/,$p' temp_json_input.txt | \
sed '1s/.*"content": "//' | \
sed 's/\\n/\
/g' | \
sed 's/\\"/"/g' | \
sed 's/\\\\/\\/g' > temp_content.txt

mkdir -p "$(dirname "$file_name")"
mv "$file_name.tmp" "$file_name"

rm temp_json_input.txt temp_content.txt

echo "----------------------------"
echo "Successfully updated: $file_name"