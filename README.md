# How to add more weapons / passives

- In the vampire survivors wiki you should be able to find all the images you need, you might need to run a script like the one in docs/gen-image.md
- Put the png files in folders, e.g. under tmp folder in subfolders, I suggest you group the files in folders depending how you want to group the icons in css files
- Run the scripts/rename_sprite_files.sh to remove the 'Sprite' from filenames
- Run the scripts/gen-icons.sh to convert png files into css
- Group by group, convert the pngs into css and paste them in the appropriate file in the styles folder