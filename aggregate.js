/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const filepath1 = './data/datafile.csv';
const filepath2 = './country-continent.json';

function fileRead(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, inputFile) => {
      if (err) {
        reject(err);
      } else {
        resolve(inputFile);
      }
    });
  });
}

// console.log(countrymap[0].country);
const aggregate = async () => new Promise((resolve) => {
  Promise.all([fileRead(filepath1), fileRead(filepath2)]).then((values) => {
    const inputFile = values[0];
    const countrymap = JSON.parse(values[1]);
    function processData(allText) {
      const allTextLines = allText.split(/\r\n|\n/);
      const headers = allTextLines[0].split(',');
      const lines = [];
      for (let i = 1; i < allTextLines.length; i += 1) {
        const regex = /["]/g;
        const data = allTextLines[i].replace(regex, '').split(',');
        if (data.length === headers.length) {
          const tarr = [];
          for (let j = 0; j < headers.length; j += 1) {
            tarr.push(data[j]);
          }
          lines.push(tarr);
        }
      }
      return lines;
    }
    const outputFile = processData(inputFile);
    //  console.log(outputFile);
    const jsonString = {};
    // console.log(countryarray);
    for (let i = 0; i < outputFile.length; i += 1) {
      // console.log(outputFile[0][0]);
      if (jsonString[countrymap[outputFile[i][0]]] === undefined) {
        jsonString[countrymap[outputFile[i][0]]] = {};
        jsonString[countrymap[outputFile[i][0]]].GDP_2012 = parseFloat(outputFile[i][7]);
        jsonString[countrymap[outputFile[i][0]]].POPULATION_2012 = parseFloat(outputFile[i][4]);
      } else {
        jsonString[countrymap[outputFile[i][0]]].GDP_2012 += parseFloat(outputFile[i][7]);
        jsonString[countrymap[outputFile[i][0]]].POPULATION_2012 += parseFloat(outputFile[i][4]);
      }
    }
    delete jsonString.undefined;
    //  console.log(jsonString);
    // preserve newlines, etc - use valid JSON
    const finaljsonString = JSON.stringify(jsonString);
    fs.writeFile('./output/output.json', finaljsonString, 'utf8', () => {
      resolve();
    });
  });
});
module.exports = aggregate;
