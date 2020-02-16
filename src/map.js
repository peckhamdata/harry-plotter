const lcg = require ('./lcg.js');
const Bezier = require('bezier-js');

module.exports = class Map {
  constructor(map_width, num_curves) {
    this.map_width = map_width;
    this.num_curves = num_curves;
    this.num_lut_points = map_width * 2;
  }
  curve(num, previous) {
    var seq = lcg(this.map_width*num,
                  1,
                  this.map_width,
                  6);
    if (typeof previous !== 'undefined') {
      seq[0] = previous.points[2].x
      seq[1] = previous.points[2].y
    }
    return new Bezier(seq[1],
                      seq[0],
                      seq[2],
                      seq[3],
                      seq[4],
                      seq[5]);
  }
  horizontal_line(curve, offset) {
    if (offset == 0) {
      return {points: [{x:0, y: curve.points[0].y},
                       {x:this.map_width, y: curve.points[0].y}]}
    } else if (offset == -1) {
        return {points: [{x:0, y: curve.points[2].y},
                       {x:this.map_width, y: curve.points[2].y}]}
    } 
  }

  vertical_lines(curve, interval) {
    var lines = [];
    var i = curve.points[0].x;
    while (i < curve.points[2].x) {
      lines.push({points: [{x:i, y:0 },
                           {x:i, y:this.map_width }]});
      i+= interval;
    }
    return lines;
  }
}