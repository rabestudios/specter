const { usccSpiders } = require('../spiders');
const { stage } = require('../pipeline');
const { splunk: { splunkLogger }, writeToStore } = require('../middleware');
const { SPLUNK_CONFIG } = require('../utils/constants');

const config = {
  baseUrl: 'https://www.uschamberfoundation.org',
  seedUrls: [
    'aid-event/corporate-aid-tracker-covid-19-business-action'
  ],
  pseudoUrls: [
    'aid-event/[.*]'
  ],
  spiders: usccSpiders,
  pipeline: [
    stage.writeToCsv
  ],
  maxRequestsPerCrawl: 100,
  maxConcurrency: 10,
  outputDir: '.output',
  outputFile: 'companies.csv',
  middleware: [
    splunkLogger(SPLUNK_CONFIG),
    writeToStore({ keyProp: 'title' })
  ]
};

module.exports = config;
