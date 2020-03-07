const Bezier = require('bezier-js');

const GSheetPlotter = require('../src/gsheet_plotter');
jest.mock('google-spreadsheet');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const mock_auth = jest.fn();
mock_auth.mockReturnValue(new Promise((resolve, reject) => {
  resolve('goat');
}));

const mock_loadinfo = jest.fn();
mock_loadinfo.mockReturnValue(new Promise((resolve, reject) => {
  resolve('goat');
}));

const mock_loadcells = jest.fn();
mock_loadcells.mockReturnValue(new Promise((resolve, reject) => {
  resolve('goat');
}));

const mock_sheet = {updateDimensionProperties: jest.fn(),
                    loadCells: mock_loadcells,
                    getCell: jest.fn(),
                    saveUpdatedCells: jest.fn()}

var mock_cells = [];

mock_sheet.getCell.mockImplementation(() => {
      var cell = {}
      mock_cells.push(cell)
      return cell;
    });

GoogleSpreadsheet.mockImplementation(() => {
      return {
        useServiceAccountAuth: mock_auth,
        sheetsByIndex: [mock_sheet],
        loadInfo: mock_loadinfo
      };
    });

describe('GSheetPlotter', () => {

  var sheet_id = 'something-or-other';

  // And credentials to write to that Sheet
  var creds = {};

  it('Sets the size of cells in the spreadsheet', async () => {

  });

  it('Loads the cells from the spreadsheet', async () => {

    var plotter = new GSheetPlotter(sheet_id, creds);
    await plotter.init();

    expect(mock_auth).toHaveBeenCalledWith(creds);

    // Then it should access the sheet in Google

    await(mock_loadinfo())
    await(mock_loadcells())

  });


  it('Plots a set of points to GSheet', async () => {

    // Given a Bezier curve
    var curve = new Bezier(1,2,3,4,5,6).getLUT();

    // And an RGB value
    var colour = {red:1, blue:2, green:3};
    // And the ID of a Google Sheet

    var plotter = new GSheetPlotter(sheet_id, creds);
    await plotter.init();

    // When we ask for it to be rendered
    await plotter.plot_points(curve, colour);

    // And for each point in the curve
    curve.forEach(function(p) { 
      // we get the relavent gsheet cell
      expect(mock_sheet.getCell)
      .toHaveBeenCalledWith(Math.floor(p.x),Math.floor(p.y));
    });

    mock_cells.forEach(function(p) { 
    // And set it's colour to the RGB value
      expect(p).toEqual({backgroundColor: colour})
    });

    // And it should save the results to the sheet
    plotter.write();
    expect(mock_sheet.saveUpdatedCells).toHaveBeenCalled();    
  });

});
