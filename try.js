/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const countrymap = require('./country-continent');

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

function fileWrite(filepath, jsonString) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, jsonString, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(jsonString);
      }
    });
  });
}
// console.log(countrymap[0].country);
const aggregate = async (filepath) => {
  const inputFile = await fileRead(filepath);
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

  const finaloutput = [['South America', 0, 0],
    ['Oceania', 0, 0],
    ['North America', 0, 0],
    ['Asia', 0, 0],
    ['Europe', 0, 0],
    ['Africa', 0, 0]];


  //  console.log(countrymap[0].continent);
  for (let i = 0; i < outputFile.length; i += 1) {
    for (let j = 0; j < countrymap.length; j += 1) {
      // console.log(outputFile[0][0]);
      if (outputFile[i][0] === countrymap[j].country) {
        //  console.log(countrymap[j].continent);
        if (countrymap[j].continent === 'South America') {
          finaloutput[0][1] += parseFloat(outputFile[i][7]);
          finaloutput[0][2] += parseFloat(outputFile[i][4]);
        }
        if (countrymap[j].continent === 'Oceania') {
          finaloutput[1][1] += parseFloat(outputFile[i][7]);
          finaloutput[1][2] += parseFloat(outputFile[i][4]);
        }
        if (countrymap[j].continent === 'North America') {
          finaloutput[2][1] += parseFloat(outputFile[i][7]);
          finaloutput[2][2] += parseFloat(outputFile[i][4]);
        }
        if (countrymap[j].continent === 'Asia') {
          finaloutput[3][1] += parseFloat(outputFile[i][7]);
          finaloutput[3][2] += parseFloat(outputFile[i][4]);
        }
        if (countrymap[j].continent === 'Europe') {
          finaloutput[4][1] += parseFloat(outputFile[i][7]);
          finaloutput[4][2] += parseFloat(outputFile[i][4]);
        }
        if (countrymap[j].continent === 'Africa') {
          finaloutput[5][1] += parseFloat(outputFile[i][7]);
          finaloutput[5][2] += parseFloat(outputFile[i][4]);
        }
      }
    }
  }

  let jsonString = '{\n';
  for (let i = 0; i < finaloutput.length; i += 1) {
    jsonString = jsonString.concat(`"${finaloutput[i][0]}": {\n"GDP_2012": ${finaloutput[i][1]},\n"POPULATION_2012": ${finaloutput[i][2]}},`);
  }

  jsonString = jsonString.slice(0, -1);
  jsonString += '}';
  //  console.log(jsonString);
  // preserve newlines, etc - use valid JSON
  await fileWrite('./output/output.json', jsonString);
};

aggregate('./data/datafile.csv');

module.exports = aggregate;
