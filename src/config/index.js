const foodistaConf = require('./foodista.conf');
const usccConf = require('./uscc.conf');
const powerballConf = require('./powerball.conf');
const {
  REQUIRED_CONFIG_FIELDS,
  DEFAULT_CONFIG_VALUES
} = require('../utils/constants');

const configList = {
  foodista: {
    config: foodistaConf,
    isActive: false
  },
  uscc: {
    config: usccConf,
    isActive: false
  },
  powerball: {
    config: powerballConf,
    isActive: true
  }
};

// ----------------------
//     Helper Functions
// ----------------------

function setDefaultValues(config) {
  for (const key of Object.keys(DEFAULT_CONFIG_VALUES)) {
    if (config[key] === undefined) {
      config[key] = DEFAULT_CONFIG_VALUES[key];
    }
  }
}

function getMissingBaseFields(config) {
  const missingFields = [];
  // verify base config fields
  for (const field of REQUIRED_CONFIG_FIELDS) {
    if (!config[field]) {
      missingFields.push(field);
    }
  }
  return missingFields;
}

function getMissingPipelineFields(config) {
  const missingFields = [];
  for (const stage of config.pipeline) {
    const stageFields = stage.getRequiredConfig();
    for (const field of stageFields) {
      if (!config[field]) {
        missingFields.push(field);
      }
    }
  }
  return missingFields;
}

function getMissingFields(config) {
  const baseFields = getMissingBaseFields(config);
  const pipelineFields = getMissingPipelineFields(config);

  return [ ...baseFields, ...pipelineFields ];
}

function setMiddlewareFields(config) {
  const middleware = {
    preExecution: [],
    postExecution: [],
    errorHandlers: []
  };
  // sort into buckets
  for (const item of config.middleware) {
    if (item.execType.includes('pre')) {
      middleware.preExecution.push(item.middlewareFunc);
    }
    if (item.execType.includes('post')) {
      middleware.postExecution.push(item.middlewareFunc);
    }
    if (item.execType.includes('error')) {
      middleware.errorHandlers.push(item.middlewareFunc);
    }
  }
  config.middleware = middleware;
}

// ----------------------
//     Main Functions
// ----------------------

function getActiveConfig() {
  for (const key in configList) {
    const config = configList[key];
    if (config.isActive) {
      setDefaultValues(config.config);
      setMiddlewareFields(config.config);
      return config.config;
    }
  }
  return undefined;
}

function isValidConfig(config) {
  const missingFields = getMissingFields(config);
  if (missingFields.length > 0) {
    console.log('Error: Config has missing fields');
    for (const field of missingFields) {
      console.log(`\t- ${field}`);
    }
    return false;
  }
  return true;
}

module.exports = {
  configList,
  getActiveConfig,
  isValidConfig
};
