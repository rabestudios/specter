const apify = require('apify');

async function getRequestQueue(baseUrl, seedUrls, pseudoUrls) {
  const requestQueue = await apify.openRequestQueue();
  for (const url of seedUrls) {
    await requestQueue.addRequest({ url: `${baseUrl}/${url}` });
  }
  const apifyPseudoUrls = pseudoUrls
    .map(url => new apify.PseudoUrl(`${baseUrl}/${url}`));
  return {
    requestQueue,
    pseudoUrls: apifyPseudoUrls
  };
}

module.exports = {
  getRequestQueue
};
