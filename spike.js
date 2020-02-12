const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet('1evafmirr85-FMAYFhmlsS-jZ62vwrPgo3cISmSjXSrI');
doc.useServiceAccountAuth(require('./bc-map-268007-7e2ca0c52eb6.json'))
  .then(value => {doc.loadInfo()
    .then(function(value) {
      const sheet = doc.sheetsByIndex[0];
      sheet.updateDimensionProperties("COLUMNS", 
                                      {pixelSize: 2},
                                      {startIndex: 0, endIndex: 5})
    })
    .then(function(value) {
      const sheet = doc.sheetsByIndex[0];
      sheet.updateDimensionProperties("ROWS", 
                                      {pixelSize: 2},
                                      {startIndex: 0, endIndex: 5})
    })},
        reason => {console.log(reason)});
