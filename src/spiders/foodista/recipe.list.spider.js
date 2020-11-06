const url = require('url');

async function canExtract(request, page) {
  const content = await page.$$('.field-content');
  return content.length > 0;
}

async function extractData(request, page) {
  const reqUrl = url.parse(request.url);
  const elements = await page.$$('.field-content');
  const data = [];
  for (const elem of elements) {
    const title = await elem.$eval('a', item => item.textContent.trim());
    const sourcePath = await elem.$eval('a', item => item.getAttribute('href'));
    if (title) {
      data.push({
        title,
        sourceUrl: `${reqUrl.protocol}//${reqUrl.hostname}${sourcePath}`
      });
    }
  }
  return data;
}

module.exports = {
  name: 'Recipe List Spider',
  canExtract,
  extractData
};
