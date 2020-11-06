const axios = require('axios');

// determines when it will be executed during data collection
// pre - executed before data collection
// post - executed after data collection
// error - executed when error occurs
const execType = [ 'pre', 'post', 'error' ];

// Payload properties
// - id
// - request
// - response
// - data
// - message
// - name
// - store

// EventData props
// - isArray: bool
// - data: obj

// Config Properties
// - host: string
// - token: string
// - index: string
// - createEvent: (payload) => EventData

module.exports = function (config = { execType }) {
  const requiredFields = [ 'host', 'token', 'createEvent', 'index' ];

  const missingFields = [];

  for (const field of requiredFields) {
    if (config[field] === undefined) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    throw new Error(`Missing fields in splunk.collector: ${missingFields.toString()}`);
  }

  const postEvent = async (host, token, event, index) => {
    if (event) {
      const splunkHecURL = `${host}:8088/services/collector/event`;
      try {
        await axios.post(splunkHecURL, { event, index }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Splunk ${token}`
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const middlewareFunc = async (payload) => {
    const { host, token, createEvent, index } = config;
    const event = createEvent(payload);
    if (event.isArray) {
      for (const item of event.data) {
        await postEvent(host, token, item, index);
      }
    } else {
      await postEvent(host, token, event.data, index);
    }
  };

  return {
    execType: config.execType ? config.execType: execType,
    middlewareFunc
  };
};
