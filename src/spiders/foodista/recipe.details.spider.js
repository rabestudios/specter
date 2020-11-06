async function canExtract(request, page) {
  const content = await page.$$('.field-content');
  return content.length === 0;
}

async function extractImage(group) {
  return await group.$eval('.field-item img', elem => elem.getAttribute('src'));
}

async function extractIngredients(group) {
  return await group.$$eval('.field-item', elements => elements.map(elem => elem.textContent));
}

async function extractSteps(group) {
  const elements = await group.$$('.field-item');
  const steps = [];
  for (const elem of elements) {
    const step = await elem.$eval('.step-number', elem => elem.textContent.trim());
    const instruction = await elem.$eval('.step-body', elem => elem.textContent.trim());
    steps.push({ step, instruction });
  }
  return steps;
}

async function checkIsImage(group) {
  return (await group.$$('.field-item img')).length > 0;
}

async function checkHasSteps(group) {
  return (await group.$$('.step-number')).length > 0;
}

async function checkIsIngredients(group) {
  return (await group.$$eval('.field-item',
    elements => elements.map(elem => elem.getAttribute('itemprop'))))
    .some(elem => elem === 'ingredients');
}

async function extractData(request, page) {
  const title = await page.$eval('.title', elem => elem.textContent.trim());
  const url = request.url;
  const details = { title, url };
  // extract fields and collect data
  const groups = await page.$$('.field-items');
  for (const group of groups) {
    const isImage = await checkIsImage(group);
    const hasSteps = await checkHasSteps(group);
    const isIngredients = await checkIsIngredients(group);
    // extract values
    if(isImage) {
      details.imageURL = await extractImage(group);
    } else if (hasSteps) {
      details.steps = await extractSteps(group);
    } else if (isIngredients) {
      details.ingredients = await extractIngredients(group);
    }
  }

  return details;
}

module.exports = {
  name: 'Recipe Details Spider',
  canExtract,
  extractData
};
