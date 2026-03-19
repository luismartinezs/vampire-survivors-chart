How to add new weapons, passives or evolutions

- Add new CSS icons somewhere under styles folder, and import to styles/global.css. Note the name of the CSS class to use later
- Add a new item to the appropriate object in @data/weapons.ts (or @data/passives.ts), in the order you want the UI to show it
- Add the evolution in the correct placement in @data/evolutions.ts
  - use the correct tags, e.g. `['max']` if maximum passive level is required
  - use the correct operators
  - make sure to increment the id, do not repeat ids