const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class GSheetPlotter {
  constructor(sheet_id, creds) {
    this.doc = new GoogleSpreadsheet(sheet_id);
    this.creds = creds;
  }

  plot() {
    var doc = this.doc
    doc.useServiceAccountAuth(this.creds)
    .then (value => {doc.loadInfo()
      .then(function(value) {;
        const sheet = doc.sheetsByIndex[0];
        doc.sheetsByIndex[0].saveUpdatedCells();
      })
    })
  }
}