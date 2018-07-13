/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const countrymap = require('./country-continent');


// console.log(countrymap[0].country);
const aggregate = (filepath) => {
  const inputFile = fs.readFileSync(filepath, 'utf8');

  //  console.log(inputFile);

  function CSVToArray(strData, strDelimiter) {
    // Create a regular expression to parse the CSV values.
    const objPattern = new RegExp(
      (
        // Delimiters.
        `(\\${strDelimiter}|\\r?\\n|\\r|^)`

        // Quoted fields.
        + '(?:"([^"]*(?:""[^"]*)*)"|'

        // Standard fields.
        + `([^"\\${strDelimiter}\\r\\n]*))`
      ),
      'gi',
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    const arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    arrMatches = objPattern.exec(strData);
    while (arrMatches) {
      // Get the delimiter that was found.
      const strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }
      let strMatchedValue;
      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(
          new RegExp('""', 'g'),
          '"',
        );
      } else {
        // We found a non-quoted value.
        [strMatchedValue] = [arrMatches[3]];
      }
      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
      arrMatches = objPattern.exec(strData);
    }

    // Return the parsed data.
    return (arrData);
  }

  const outputFile = CSVToArray(inputFile, ',');
  //  console.log(outputFile[1][0]);

  const finaloutput = [['South America', 0, 0],
    ['Oceania', 0, 0],
    ['North America', 0, 0],
    ['Asia', 0, 0],
    ['Europe', 0, 0],
    ['Africa', 0, 0]];

  let i;
  let j;
  //  console.log(countrymap[0].continent);
  for (i = 0; i < outputFile.length; i += 1) {
    for (j = 0; j < countrymap.length; j += 1) {
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
  for (i = 0; i < finaloutput.length; i += 1) {
    jsonString = jsonString.concat(`"${finaloutput[i][0]}": {\n"GDP_2012": ${finaloutput[i][1]},\n"POPULATION_2012": ${finaloutput[i][2]}},`);
  }

  jsonString = jsonString.slice(0, -1);
  jsonString += '}';
  //  console.log(jsonString);
  // preserve newlines, etc - use valid JSON

  fs.writeFileSync('./output/output.json', jsonString, (err) => {
    if (err) throw err;
    //  console.log('Saved!');
  });
};

aggregate('./data/datafile.csv');

module.exports = aggregate;
