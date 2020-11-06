const mkdirp = require('mkdirp');
const otcsv = require('objects-to-csv');
const path = require('path');

/**
 * Writes data arrays to CSV
 * @param data
 * @param config
 * @returns {Promise<void>}
 */
async function apply(data, config) {
  const outputDir = config.outputDir;
  const outputFile = config.outputFile;
  await mkdirp(outputDir);
  const filePath = path.join(outputDir, outputFile);
  const values = Object.keys(data).map(key => data[key]);
  await new otcsv(values).toDisk(filePath, { allColumns: true });
}

function getRequiredConfig() {
  return [ 'outputDir', 'outputFile' ];
}

module.exports = {
  apply,
  getRequiredConfig
};
