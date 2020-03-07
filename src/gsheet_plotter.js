const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class GSheetPlotter {
  constructor(sheet_id, creds, img_size) {
    this.doc = new GoogleSpreadsheet(sheet_id);
    this.creds = creds;
    this.img_size = img_size;
    this.sheet = undefined;
  }

  async init() {
    await this.doc.useServiceAccountAuth(this.creds)
    await this.doc.loadInfo()
    this.sheet = this.doc.sheetsByIndex[0];

    return this.sheet.loadCells({startRowIndex: 0, 
                    endRowIndex: this.img_size+1,
                    startColumnIndex:0,
                    endColumnIndex: this.img_size+1}).then(function(value) {
    })
  }

  plot_points(points, color) {
    var sheet = this.sheet;
    points.forEach(function(p) { 
      try {
        const cell = sheet.getCell(Math.floor(p.x),Math.floor(p.y));
        cell.backgroundColor = color;
      } catch (err) {
        console.log(err);
      }
    })
  }

  write() {
    this.sheet.saveUpdatedCells();
  }
}
