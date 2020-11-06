const { powerballSpiders } = require("../spiders");
const { splunk: { splunkLogger, splunkStore } } = require("../middleware");
const { SPLUNK_CONFIG } = require("../utils/constants");

function getSeedUrls() {
  const baseUrl = "powerball/results-archive";
  const seedUrls = [];
  for (let i = 1996; i <= 2020; i++) {
    seedUrls.push(`${baseUrl}-${i}`);
  }
  return seedUrls;
}

const config = {
  baseUrl: 'https://australia.national-lottery.com',
  seedUrls: getSeedUrls(),
  pseudoUrls: [
    'powerball/results-archive-[.*]'
  ],
  spiders: powerballSpiders,
  pipeline: [],
  maxRequestsPerCrawl: 'disabled',
  maxConcurrency: 10,
  middleware: [
    splunkLogger(SPLUNK_CONFIG),
    splunkStore(SPLUNK_CONFIG)
  ]
};

module.exports = config;
