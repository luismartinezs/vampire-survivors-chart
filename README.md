# How to add more weapons / passives

- In the vampire survivors wiki you should be able to find all the images you need, you might need to run a script like the one in context/engineering/guides/gen-image.md
- Put the png files in folders, e.g. under tmp folder in subfolders, I suggest you group the files in folders depending how you want to group the icons in css files
- Run the scripts/engineering/rename_sprite_files.sh to remove the 'Sprite' from filenames
- Run the scripts/engineering/convert-to-webp.sh to convert the pngs to lossless WebP (requires `webp` and `imagemagick`)
- Run the scripts/engineering/gen-icons-webp.sh to convert the webp files into css classes
- Group by group, paste the generated classes in the appropriate file in the styles folder
- Only add icons that are actually referenced by `image:` fields in `data/*.ts` — unreferenced classes ship to every visitor as dead weight
