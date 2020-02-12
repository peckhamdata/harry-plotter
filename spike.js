const { GoogleSpreadsheet } = require('google-spreadsheet');
const Bezier = require('bezier-js');

const mapSize = 128;

const doc = new GoogleSpreadsheet('1evafmirr85-FMAYFhmlsS-jZ62vwrPgo3cISmSjXSrI');
doc.useServiceAccountAuth(require('./bc-map-268007-7e2ca0c52eb6.json'))
  .then(value => {doc.loadInfo()
    .then(function(value) {
      const sheet = doc.sheetsByIndex[0];

      sheet.updateDimensionProperties("COLUMNS", 
                                      {pixelSize: 5},
                                      {startIndex: 0, endIndex: mapSize})

      sheet.updateDimensionProperties("ROWS", 
                                      {pixelSize: 5},
                                      {startIndex: 0, endIndex: mapSize})

      sheet.loadCells('A1:IV255').then(function(value) {

      var curve = new Bezier(1,1 , 80,30 , mapSize-1,mapSize-1);
      var LUT = curve.getLUT(mapSize);
      LUT.forEach(function(p) { 
        var x = Math.floor(p.x);
        var y = Math.floor(p.y);
        console.log(x,y);
        var point = sheet.getCell(x,y);
        point.value = '*';
        point.backgroundColor = { red: 255, green: 0, blue: 0};
        sheet.saveUpdatedCells(); // save all updates in one call      
      });

      // foo.effectiveFormat.backgroundColor = { red: 255, green: 0, blue: 0};
      // sheet.saveUpdatedCells(); // save all updates in one call      

    })

    //   sheet.updateDimensionProperties("COLUMNS", 
    //                                   {pixelSize: 5},
    //                                   {startIndex: 0, endIndex: 99})
    // })
    // .then(function(value) {
    //   const sheet = doc.sheetsByIndex[0];
    //   sheet.updateDimensionProperties("ROWS", 
    //                                   {pixelSize: 5},
    //                                   {startIndex: 0, endIndex: 99})

    })},
        reason => {console.log(reason)});
