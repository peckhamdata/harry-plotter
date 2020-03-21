const Jimp = require('jimp');

module.exports = class JimpPlotter{
  constructor(img_path, img_width, img_height) {
    this.img_path = img_path;
    this.img_width = img_width;
    this.img_height = img_height;
    this.bg_color = 0x000000ff;
  }

  async init(result) {
    this.jimp = new Jimp(this.img_width,
               this.img_height,
               this.bg_color,
               result);
  }

  plot_points(points, color) {
    var jimp = this.jimp;
    points.forEach(function(p) {
      var hex = Jimp.rgbaToInt(color.red, color.green, color.blue, 255);
      jimp.setPixelColor(hex, p.x, p.y);
    })
  }

  write() {
    this.jimp.write(this.img_path);
  }
}