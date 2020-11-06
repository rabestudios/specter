async function canExtract(request, page) {
  return true; // no validation required
}

async function extractResults(row) {
  const date = await row.$eval('.centred.noBefore.colour a', item => item.textContent.trim());
  const powerball = await row.$eval('.result.powerball-powerball', item => item.textContent.trim());
  const balls = await row.$$eval('.result.powerball-ball', rows => rows.map(item => item.textContent.trim()));
  return {
    date: date ? new Date(date).toISOString() : undefined,
    powerball,
    balls: balls ? balls.join(',') : ''
  }
}

async function extractData(request, page) {
  const data = [];
  const url = request.url;
  const table = await page.$$('tbody tr');
  for (const row of table) {
    const results = await extractResults(row);
    if (results.date) {
      data.push({...results, url});
    }
  }
  return data;
}

module.exports = {
  name: 'Powerball Results Spider',
  canExtract,
  extractData
}
