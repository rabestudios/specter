async function canExtract(request, page) {
  const groupContent = await page.$$('.group-content');
  return groupContent.length === 0;
}

async function extractData(request, page) {
  const details = {};
  const content = await page.$('section.content');
  if (content) {
    const title = await content.$eval('.title', item => item.textContent.trim());
    const description = await content.$$eval('.field-item p',
      items => items.map(item => item.textContent.trim()));
    details.title = title;
    details.companyName = title.split('- Coronavirus')[0].trim();
    details.description = description.join('\n');
    details.url = request.url;
  }
  return details;
}

module.exports = {
  name: 'Company Details Spider',
  canExtract,
  extractData
};
