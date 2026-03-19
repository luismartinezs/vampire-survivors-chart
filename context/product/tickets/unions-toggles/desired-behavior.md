We need to show certain recipes when certain components of the recipe are visible

let's take these recipes for example:

santa_water + attractorb = la_borra
la_borra + hydroStorm = hydroPumpClimax

Or, more generally:

weapon_a + passive = evolution
evolution + weapon_b = union

santa_water is a weapon (or base weapon)
attractorb is a passive
la_borra is an evolution (or weapon evolution)
hydroStorm is a weapon (or base weapon)
hydroPumpClimax is a union (or weapon union)

The user can select any components which are not unions or evolutions. In this case: santa_water, attractorb and hydroStorm

We have two separate toggles for each behavior:

- passivesShowDerivedRecipes: when true, if the passive is selected, show both relations
- weaponsShowDerivedRecipes: when true, if either base weapon is selected, show both recipes

A summary of the expected behavior, default values are all false:

- all false: show only recipes that explicitly contain the selected component
- passivesShowDerivedRecipes = true. if attractorb is selected, show both recipes
- weaponsShowDerivedRecipes = true. if either santa_water or hydroStorm are selected, show both recipes
