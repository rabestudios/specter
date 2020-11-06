const csvToJson = require('csvtojson/v1');

/**
 * Converts comma delimited values to a JSON object
 * @param data
 * @returns {Promise<Array>}
 */
async function apply(data) {
  const parseRow = (row) => {
    const newRow = { ...row };
    for (const column in row) {
      try {
        if (Object.hasOwnProperty.call(row, column)) {
          const value = row[column];
          newRow[column] = JSON.parse(value);
        }
      } catch (e) {
        // ignore parsing errors
      }
    }
    return newRow;
  };

  return new Promise((resolve, reject) => {
    let jsonRes = [];
    csvToJson()
      .fromString(data)
      .on('json', row => jsonRes.push(parseRow(row)))
      .on('done', err => {
        if (err) {
          reject(err);
        } else {
          resolve(jsonRes);
        }
      });
  });
}

function getRequiredConfig() {
  return [];
}

module.exports = {
  apply,
  getRequiredConfig
};
