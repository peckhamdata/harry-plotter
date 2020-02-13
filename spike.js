const { GoogleSpreadsheet } = require('google-spreadsheet');
const Bezier = require('bezier-js');
const lcg = require('./lcg.js');

const mapSize = 64;

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

      sheet.loadCells('A1:HG120').then(function(value) {
      var i = 0;
      var seq = lcg(mapSize*i,1, mapSize, 6)
      var colours = [
        { red: 0.91764706, green: 0.2627451, blue: 0.20784314 },
        { red: 0.003921569, green: 0.9647059, blue: 0.9647059 },
        { red: 0.99607843, green: 0.6117647, blue: 0.9647059 },
        { red: 0.27450982, green: 0.7411765, blue: 0.7764706 },
        { red: 0.40392157, green: 0.30588236, blue: 0.654902 },
        { red: 1 },
        { red: 1, blue: 1 },
        { red: 1, green: 1 },
        { red: 0.91764706, green: 0.2627451, blue: 0.20784314 },
        { red: 0.91764706, green: 0.2627451, blue: 0.20784314 }
      ]
      var last_k = 0;
      for (i=1; i<9; i++) {
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
        var LUT = curve.getLUT(mapSize * 2);
        LUT.forEach(function(p, k) { 
          var x = Math.floor(p.x);
          var y = Math.floor(p.y);
          var point = sheet.getCell(x,y);

          // Vertical lines every N
          if (k % 50 === 0) {
            if (k != last_k) {
              var j = 0;
              for (j = 0; j < mapSize; j++) {
                var sidepoint = sheet.getCell(j, y)              
                sidepoint.backgroundColor = colours[i];
              }
            }
            last_k = k;
          } 
          if (k === 0) {
            var j = 0;
            for (j = 0; j < mapSize; j++) {
              var sidepoint = sheet.getCell(y, j)              
              sidepoint.backgroundColor = colours[i];
            }
          }

          point.backgroundColor = colours[i];
        });
        sheet.saveUpdatedCells(); // save all updates in one call      
      }

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
