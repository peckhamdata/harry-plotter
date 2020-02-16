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

const mock_sheet = {updateDimensionProperties: jest.fn(),
                    loadCells: jest.fn(),
                    getCell: jest.fn(),
                    saveUpdatedCells: jest.fn()}

GoogleSpreadsheet.mockImplementation(() => {
      return {
        useServiceAccountAuth: mock_auth,
        sheetsByIndex: [mock_sheet],
        loadInfo: mock_loadinfo
      };
    });

describe('GSheetPlotter', () => {
  it('Plots a curve to GSheet', async () => {

    // Given a Bezier curve
    var curve = new Bezier(1,2,3,4,5,6);

    // And an RGB value

    // And the ID of a Google Sheet
    var sheet_id = 'something-or-other';

    // And credentials to write to that Sheet
    var creds = {};

    var plotter = new GSheetPlotter(sheet_id, creds);
    expect(GoogleSpreadsheet).toHaveBeenCalledWith(sheet_id);

    // When we ask for it to be rendered
    await plotter.plot(curve);
    expect(mock_auth).toHaveBeenCalledWith(creds);


    // Then it should access the sheet in Google
    await(mock_loadinfo())

    // And for each point in the curve
    // we get the relavent gsheet cell

    // And set it's colour to the RGB value

    // And it should save the results to the sheet
    expect(mock_sheet.saveUpdatedCells).toHaveBeenCalled();    
  });
});
