const JimpPlotter = require('../src/jimp_plotter');
const Bezier = require('bezier-js');

jest.mock('jimp');
const Jimp = require('jimp');


var mock_pixel_color = jest.fn();

Jimp.mockImplementation(() => {
  return {
    setPixelColor: mock_pixel_color
  };
});

describe('JimpPlotter', () => {

  it('Initialises the image', async () => {
    var img_size = 255;
    var a_function = jest.fn();
    jimp_plotter = new JimpPlotter('path/to/file.png',
                                   img_size);
    await jimp_plotter.init(a_function);
    expect(Jimp).toHaveBeenCalledWith(
      img_size, 
      img_size, 
      0x000000ff, 
      a_function);

  });

  it('Plots a series of points', async () => {
    var img_size = 255;
    var a_function = jest.fn();
    jimp_plotter = new JimpPlotter('path/to/file.png',
                                   img_size);
    await jimp_plotter.init(a_function);
    // Given a Bezier curve
    var curve = new Bezier(1,2,3,4,5,6).getLUT();

    // And an RGB value
    var colour = {red:1, blue:2, green:3};
  
    await jimp_plotter.plot_points(curve, colour);
    expect(mock_pixel_color).toHaveBeenCalled();
  });

});