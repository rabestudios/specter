async function canExtract(request, page) {
  const groupContent = await page.$$('.group-content');
  return groupContent.length > 0;
}

async function extractData(request, page) {
  const companies = [];
  const elements = await page.$$('.group-content');
  for (const elem of elements) {
    const title = await elem.$eval('.field-item a', item => item.textContent.trim());
    const companyName = await elem.$eval('h2 a', item => item.textContent.trim());
    companies.push({ title, companyName });
  }
  return companies;
}

module.exports = {
  name: 'Company List Spider',
  canExtract,
  extractData
};
