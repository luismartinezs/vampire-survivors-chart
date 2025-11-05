in vampire survivors there are weapon evolutions and weapon unions

evolutions result from combining a weapon and a passive

unions result from combining two weapons

certain unions result from combining an evolution and a weapon. for example, the hydroPumpClimax union is a result of hydroStorm (a base weapon) and la_borra (an evolution of santa_water weapon and attractorb passive)

i.e.:

santa_water + attractorb -> la_borra
la_borra + hydroStorm -> hydroPumpClimax

currently there are toggles such that if attractorb (passive) or santa_water (weapon) are selected, then la_borra + hydroStorm -> hydroPumpClimax is also displayed

I would also like an additional toggle that does this, in this particular example (but generalized to all such cases):

if user selects hydroStorm weapon, then also show santa_water + attractorb -> la_borra

more in general

given:

- toggle
- relation: A + B = C
- relation: C + D = E

- if toggle is false, and user selects D, show only C + D = E
- if toggle is true, and user selects D, then show both A + B = C and C + D = E