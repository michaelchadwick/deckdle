# Deckdle

Daily [Golf](https://en.wikipedia.org/wiki/Golf_(patience)) solitaire card game. Everyone gets the same setup and the same stock. Get the highest score you can!

More expository words spilled digitally about Deckdle [are available if interested](https://michaelchadwick.info/blog/2024/09/11/deckdle-is-live/).

## Golf Scores and Names

Deckdle uses a semi-standard naming convention for golf scores. Some scores will display a picture upon achieving. All images taken from [AI Emojis](https://emojis.sh). Credit is given when the picture has attribution.

* 6 Below Par: -6: Phoenix (<https://emojis.sh/hello0538>)
* 5 Below Par: -5: Ostrich
* 4 Below Par: -4: Condor (Triple Eagle) (<https://emojis.sh/hugosueiras>)
* 3 Below Par: -3: Albatross (Double Eagle)
* 2 Below Par: -2: Eagle (<https://emojis.sh/mortezazarein_s>)
* 1 Below Par: -1: Birdie (<https://emojis.sh/keorapetsebtn>)
* Exactly Par: 0
* 1 Above Par: +1: Bogie
* 2 Above Par: +2: Double Bogie
* 3 Above Par: +3: Triple Bogie
* 4 Above Par: +4: Quadruple Bogie

## Subsystems

### Audio

Uses [webaudio-tinysynth](https://github.com/g200kg/webaudio-tinysynth) for making noise.

### Randomness

Uses [chance.js](https://github.com/chancejs/chancejs) for seeding puzzles.
