const { foodistaSpiders } = require('../spiders');
const { splunk: { splunkLogger, splunkStore } } = require('../middleware');
const { SPLUNK_CONFIG } = require('../utils/constants');

// creating seed urls to avoid dynamically changing URLs
function getSeedUrls() {
  const baseUrl = 'browse/recipes';
  const seedUrls = [ baseUrl ];
  for(let i = 1; i <= 280; i++) {
    seedUrls.push(`${baseUrl}?page=${i}`);
  }
  return seedUrls;
}

const config = {
  baseUrl: 'https://www.foodista.com',
  seedUrls: [],
  pseudoUrls: [
    'recipe/[.*]'
  ],
  spiders: foodistaSpiders,
  pipeline: [],
  maxRequestsPerCrawl: 'disabled',
  maxConcurrency: 10,
  outputDir: 'output',
  outputFile: 'recipe.csv',
  middleware: [
    splunkLogger(SPLUNK_CONFIG),
    splunkStore(SPLUNK_CONFIG)
  ]
};

module.exports = config;
