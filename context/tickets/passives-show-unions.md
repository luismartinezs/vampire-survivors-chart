in vampire survivors there are weapon evolutions and weapon unions

evolutions result from combining a weapon and a passive

unions result from combining two weapons

certain unions result from combining an evolution and a weapon. for example, the hydroPumpClimax union is a result of hydroStorm (a base weapon) and la_borra (an evolution of santa_water weapon and attractorb passive)

i.e.:

santa_water + attractorb -> la_borra
la_borra + hydroStorm -> hydroPumpClimax

currently, if santa_water or attractorb are selected, no information is displayed about the union, leaving the user guessing. But showing always all unions might be more info than the player wants to see.

So I decided to make it toggleable

If the value of the global store passivesShowUnions is true, then show the unions, e.g. in the case above, if attractorb is selected, then show la_borra + hydroStorm -> hydroPumpClimax

if the value is false, don't show it
