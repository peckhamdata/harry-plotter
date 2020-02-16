const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class GSheetPlotter {
  constructor(sheet_id, creds) {
    this.doc = new GoogleSpreadsheet(sheet_id);
    this.creds = creds;
  }

  plot_curve(curve, color, map_size) {
    var doc = this.doc
    doc.useServiceAccountAuth(this.creds)
    .then (value => {doc.loadInfo()
      .then(function(value) {
        const sheet = doc.sheetsByIndex[0];

        sheet.loadCells({startRowIndex: 0, 
                        endRowIndex: map_size,
                        startColumnIndex:0,
                        endColumnIndex: map_size}).then(function(value) {
          curve.getLUT().forEach(function(p) { 
            const cell = sheet.getCell(Math.floor(p.x),Math.floor(p.y));
            cell.backgroundColor = color;
          })
          sheet.saveUpdatedCells();
        })
      })
    })
  }
}