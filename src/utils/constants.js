const REQUIRED_CONFIG_FIELDS = [
  'baseUrl',
  'seedUrls',
  'pseudoUrls',
  'spiders',
  'pipeline',
  'maxRequestsPerCrawl',
  'maxConcurrency',
  'middleware'
];

const DEFAULT_CONFIG_VALUES = {
  maxConcurrency: 10,
  maxRequestsPerCrawl: 'auto',
  pipeline: [],
  middleware: []
};

const SPLUNK_CONFIG = {
  host: 'http://localhost',
  token: '951b5f9e-c9b1-4690-8f79-59274d5a9aa1'
};

module.exports = {
  REQUIRED_CONFIG_FIELDS,
  DEFAULT_CONFIG_VALUES,
  SPLUNK_CONFIG,
};
