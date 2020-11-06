const splunkCollector = require('./splunk.collector');

// write data to splunk
function createSplunkData({ data }) {
  return {
    isArray: Array.isArray(data),
    data
  };
}

module.exports = (config) => {
  const requiredFields = [ 'host', 'token' ];
  const missingFields = [];
  for (const field of requiredFields) {
    if (config[field] === undefined) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    throw new Error(`Missing config in splunk.logger: ${missingFields.toString()}`);
  }

  return splunkCollector({
    index: config.index ? config.index : 'specter_data',
    createEvent: createSplunkData,
    eventType: [ 'post' ],
    ...config
  });
};
