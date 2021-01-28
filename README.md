# BarLayer 

This is a custom DeckGL layer of using bars to represent values using: colour, scale, thickness and rotation angle. These are defined and used in the underlying GL (Graphics Library) via the following methods:

* `getColor`, an array of four RGBA values with default `[0, 0, 0, 255]`
* `getScale`, an integer/float with default 1
* `getWidth`, an integer/float with default 1
* `getRotationAngle`, an integera/float with default 1

For more on proportional symbol maps, you can visit Wikipedia or follow this citation: Brewer, Cynthia, and Andrew J. Campbell. "Beyond graduated circles: varied point symbols for representing quantitative data on maps." Cartographic Perspectives 29 (1998): 6-25.

## How to use it

`npm i barlayer` or `yarn add barlayer`

Say you have some election  data in geojson, like:

```js
{
  ...
 "result": "Lab hold", "first_party": "Lab", "second_party": "Con", "electorate": 50750, "valid_votes": 31598, "invalid_votes": 82, "majority": 10490, "con": 6518, "lab": 17008, "ld": 1072, "geometry": { "type": "Point", "coordinates": [ -3.7047, 51.588501 ] }
  ...
}
```
You can define a new layer for your DeckGL view as:

```js
    const arrowLayer = new BarLayer({
      id: 'bar-layer',
      data: data,
      getPosition: d => [d.geometry.coordinates[0],
      d.geometry.coordinates[1], 0],
      getColor: d => getColor(d.properties.first_party.toLowerCase()),
      getScale: d => d.properties.electorate%200,
      getRotationAngle: d => d.properties.result.includes("gain") ? 25 :0 ,
      pickable: true,
      onHover: this._hover,
    })
```

## Tests
Some basic unit tests with `jest` and `enzyme`.
Run: `yarn run test`

## Acknowledgement
This is an output from Turing Geoviuslization Engine work funded by the Alan Turing Institute and carried out at Leeds Institute for Data Analytics led by Dr [Nik Lomax](https://environment.leeds.ac.uk/geography/staff/1064/dr-nik-lomax) and Dr [Roger Beecham](https://environment.leeds.ac.uk/geography/staff/1003/dr-roger-beecham).

I could not have made sense of the whole JS/GL work done by the DeckGL team if it was not for the help on the Slack channel by [Xiaoji Chen](https://github.com/Pessimistress).