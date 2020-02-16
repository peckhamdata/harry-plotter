const Map = require("../src/map.js")
const Bezier = require('bezier-js');

jest.mock('../src/lcg.js'); 
const lcg = require('../src/lcg.js');

describe('Street', () => {
  it('creates a street in Bezier City', async () => {

    // Given a set map width
    const map_width = 10;

    // And a set number of curves
    const num_curves = 3;

    // And a number sequence generator
    lcg
      .mockReturnValue([1,2,3,4,50,60])
      .mockReturnValueOnce([1,2,3,4,5,6])
      .mockReturnValueOnce([1,2,3,4,5,6]);

    // And a bezier curve generator

    // When we ask for a curve
    map = new Map(map_width, num_curves);
    var curve = map.curve(0);

    // Then we expect the sequence generator to be used
    expect(lcg).toHaveBeenCalledWith(0, 1, map_width, 6);
    // And we get a Bezier curve back
    var expected = new Bezier(2,1,3,4,5,6);
    expect(curve).toMatchObject(expected)
    // When we've already created a curve

    // When we ask for one with co-ordinates from the previous one

    var next_curve = map.curve(1, curve)

    // Then they will be used to create the new one
    var next_expected = new Bezier(6,5,3,4,5,6);
    expect(next_curve).toMatchObject(next_expected)

    // And we get a horizontal line at the start
    var line = map.horizontal_line(curve, 0);
    expect(line).toMatchObject({points: [{x:0, y:1}, {x:10, y:1}]})
    // And the end of the curve
    var line = map.horizontal_line(curve, -1);
    expect(line).toMatchObject({points: [{x:0, y:6}, {x:10, y:6}]})

    // And we get vertical lines every N points on the curve
    var n = 5;
    var big_curve = map.curve()
    var lines = map.vertical_lines(big_curve, n);
    
    var expected_lines = [{points: [{x: 2, y: 0}, {x: 2, y: 10}]}, 
                          {points: [{x: 7, y: 0}, {x: 7, y: 10}]}, 
                          {points: [{x: 12, y: 0}, {x: 12, y: 10}]}, 
                          {points: [{x: 17, y: 0}, {x: 17, y: 10}]}, 
                          {points: [{x: 22, y: 0}, {x: 22, y: 10}]}, 
                          {points: [{x: 27, y: 0}, {x: 27, y: 10}]}, 
                          {points: [{x: 32, y: 0}, {x: 32, y: 10}]}, 
                          {points: [{x: 37, y: 0}, {x: 37, y: 10}]}, 
                          {points: [{x: 42, y: 0}, {x: 42, y: 10}]}, 
                          {points: [{x: 47, y: 0}, {x: 47, y: 10}]}]
    expect(lines).toMatchObject(expected_lines)

    // And all points and colour are sent to the renderer
  })
})
