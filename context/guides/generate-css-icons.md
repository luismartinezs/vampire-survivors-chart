From PNG to CSS icon classes

- Gather the PNG files in a local folder
- Run @scripts/convert-to-webp.sh script, it will recursively convert PNG to WebP non-destructively and auto-trim transparent pixels
```sh
./scripts/convert-to-webp.sh ./context/images
```

- Run @scripts/gen-icons-webp.sh to generate CSS classes with base64-encoded WebP data
```sh
./scripts/gen-icons-webp.sh ./context/images ./styles/category/icons.css
```