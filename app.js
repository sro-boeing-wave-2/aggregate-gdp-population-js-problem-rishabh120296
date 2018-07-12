const fs = require('fs');

const inputFile = fs.readFileSync('./data/datafile.csv', 'utf8');

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
//  console.log(outputFile);

const continent = [['Argentina', 'South America'],
  ['Australia', 'Oceania'],
  ['Japan', 'Asia'],
  ['Mexico', 'North America'],
  ['Russia', 'Asia'],
  ['Saudi Arabia', 'Asia'],
  ['South Africa', 'Africa'],
  ['Turkey', 'Asia'],
  ['United Kingdom', 'Europe'],
  ['Brazil', 'South America'],
  ['Canada', 'North America'],
  ['China', 'Asia'],
  ['France', 'Europe'],
  ['Germany', 'Europe'],
  ['India', 'Asia'],
  ['Indonesia', 'Asia'],
  ['Italy', 'Europe'],
  ['USA', 'North America'],
  ['Republic of Korea', 'Asia']];

const finaloutput = [['South America', 0, 0],
  ['Oceania', 0, 0],
  ['North America', 0, 0],
  ['Asia', 0, 0],
  ['Europe', 0, 0],
  ['Africa', 0, 0]];

let i;
let j;

for (i = 0; i < outputFile.length; i += 1) {
  for (j = 0; j < continent.length; j += 1) {
    if (outputFile[i][0] === continent[j][0]) {
      //  console.log(continent[j][1]);
      if (continent[j][1] === 'South America') {
        finaloutput[0][1] += parseFloat(outputFile[i][7]);
        finaloutput[0][2] += parseFloat(outputFile[i][4]);
      }
      if (continent[j][1] === 'Oceania') {
        finaloutput[1][1] += parseFloat(outputFile[i][7]);
        finaloutput[1][2] += parseFloat(outputFile[i][4]);
      }
      if (continent[j][1] === 'North America') {
        finaloutput[2][1] += parseFloat(outputFile[i][7]);
        finaloutput[2][2] += parseFloat(outputFile[i][4]);
      }
      if (continent[j][1] === 'Asia') {
        finaloutput[3][1] += parseFloat(outputFile[i][7]);
        finaloutput[3][2] += parseFloat(outputFile[i][4]);
      }
      if (continent[j][1] === 'Europe') {
        finaloutput[4][1] += parseFloat(outputFile[i][7]);
        finaloutput[4][2] += parseFloat(outputFile[i][4]);
      }
      if (continent[j][1] === 'Africa') {
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

fs.writeFile('./output/output.json', jsonString, (err) => {
  if (err) throw err;
  //  console.log('Saved!');
});
