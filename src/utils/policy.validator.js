const robotParser = require('robots-parser');
const axios = require('axios');

async function getPolicies(url) {
  const policies = url + '/robots.txt';
  const response = await axios.get(policies);
  if (response.status === 200) {
    const data = response.data;
    const lines = data.split('\n').filter(line => !line.startsWith('#'));
    // clean up policy data
    lines.splice(0, 1);
    lines.pop();
    return lines;
  }
  return undefined; // no policies in place
}

async function getPolicyValidator(url) {
  const policies = await getPolicies(url);
  const contents = [
    `Host: ${url}`,
    ...policies
  ];
  return robotParser(`${url}/robots.txt`, contents.join('\n'));
}

function getMaxRequestsPerDay(crawlDelay) {
  const secondsInADay = 86400;
  return crawlDelay ? Math.ceil(secondsInADay /crawlDelay) : secondsInADay;
}

function getMaxRequestsPerCrawl(maxReqPerCrawl, crawlDelay) {
  if (maxReqPerCrawl === 'auto') {
    return getMaxRequestsPerDay(crawlDelay);
  } else if (maxReqPerCrawl === 'disabled') {
    return undefined;
  } else {
    return maxReqPerCrawl;
  }
}

module.exports = {
  getPolicyValidator,
  getMaxRequestsPerCrawl
};
