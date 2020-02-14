const { GoogleSpreadsheet } = require('google-spreadsheet');
const Bezier = require('bezier-js');
const lcg = require('./lcg.js');

const mapSize = 255;
const numLutPoints = mapSize * 2;
const numLines = 9;

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

      sheet.loadCells({startRowIndex: 0, 
                      endRowIndex: mapSize,
                      startColumnIndex:0,
                      endColumnIndex: mapSize}).then(function(value) {
      var i = 0;
      var seq = lcg(mapSize*i,1, mapSize, 6)
      var last_k = 0;
      for (i=1; i<numLines; i++) {
        var curve = new Bezier(seq[1],
                               seq[0],
                               seq[2],
                               seq[3],
                               seq[4],
                               seq[5]);
        var end = [seq[4], seq[5]];
        seq = lcg(mapSize*i,1, mapSize, 6)
        seq[0] = end[0];
        seq[1] = end[1];
        var LUT = curve.getLUT(numLutPoints);
        LUT.forEach(function(p, k) { 
          var x = Math.floor(p.x);
          var y = Math.floor(p.y);
          var point = sheet.getCell(x,y);
          var rgb = lcg(mapSize-i,0, 255, 3)
          var colours = {red: rgb[0], green: rgb[1], blue: rgb[2]}
          // Vertical lines every N
          if (k % (mapSize / 2) === 0) {
            if (k != last_k) {
              var j = 0;
              for (j = 0; j < mapSize; j++) {
                var sidepoint = sheet.getCell(j, y);
                sidepoint.backgroundColor = colours;
              }
            }
            last_k = k;
          } 
          if (k === 0 || k === numLutPoints -1) {
            var j = 0;
            for (j = 0; j < mapSize; j++) {
              var sidepoint = sheet.getCell(x, j)              
              sidepoint.backgroundColor = colours;
            }
          }

          point.backgroundColor = colours;
        });
        sheet.saveUpdatedCells(); // save all updates in one call      
      }

    })

    })},
        reason => {console.log(reason)});
