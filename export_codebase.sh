#!/bin/bash
OUTPUT="/home/admin_omniveo_io/visalogic_codebase.txt"
echo "--- VISALOGIC CODEBASE EXPORT ---" > $OUTPUT
echo "This is a full export of the Next.js application codebase." >> $OUTPUT
echo "" >> $OUTPUT

# Find all relevant files, ignoring node_modules, .git, .next, and binaries
find . -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/\.git/*" \
  -not -path "*/\.next/*" \
  -not -name "package-lock.json" \
  -not -name "export_codebase.sh" \
  -not -path "*/public/*" \
  -not -name "*.jpg" -not -name "*.png" -not -name "*.ico" -not -name "*.svg" | sort | while read -r file; do
    echo "================================================================" >> $OUTPUT
    echo "FILE: $file" >> $OUTPUT
    echo "================================================================" >> $OUTPUT
    cat "$file" >> $OUTPUT
    echo "" >> $OUTPUT
    echo "" >> $OUTPUT
done
echo "Export complete."
