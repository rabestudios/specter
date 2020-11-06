const stage = {
  printToConsole: require('./print.to.console'),
  writeToCsv: require('./write.to.csv'),
  csvToJson: require('./csv.to.json')
};

async function applyPostProcessing(data, config) {
  const pipeline = config.pipeline;
  console.log('Applying post processing...');
  let processedData = data;
  for (const stage of pipeline) {
    const newData = await stage.apply(processedData, config);
    if (newData) {
      processedData = newData;
    }
  }
  console.log('Done');
  return processedData;
}

module.exports = {
  applyPostProcessing,
  stage
};
