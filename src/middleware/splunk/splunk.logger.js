const splunkCollector = require('./splunk.collector');

// splunk logging event
function createSplunkLogs({ id, request, response, data, message, name, requestQueue }) {
  const state = data ? 'SUCCESS' : message ? 'FAIL' : 'RUNNING';
  const count = requestQueue ? requestQueue.pendingCount : undefined;
  return {
    id,
    url: request.url,
    status: response.status(),
    message,
    name,
    state,
    pending: count
  };
}

const createEventData = (payload) => {
  const logs = createSplunkLogs(payload);
  return {
    isArray: false,
    data: logs
  }
};

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
    index: config.index ? config.index : 'specter_logs',
    createEvent: createEventData,
    ...config
  });
};
