const apify = require('apify');
const { getRequestQueue } = require('./scheduler');
const { getCustomStore } = require('./store');
const { applyPostProcessing } = require('./pipeline');
const { getActiveConfig, isValidConfig } = require('./config');
const { createCrawler } = require('./crawler');

apify.main(async () => {
  const config = await getActiveConfig();
  if (isValidConfig(config)) {
    const store = getCustomStore();
    const {
      requestQueue,
      pseudoUrls
    } = await getRequestQueue(config.baseUrl, config.seedUrls, config.pseudoUrls);

    const crawler = await createCrawler(requestQueue, pseudoUrls, config, store);
    await crawler.run();

    await applyPostProcessing(store.data, config);
  }
});
