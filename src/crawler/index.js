const apify = require('apify');
const { getPolicyValidator, getMaxRequestsPerCrawl } = require('../utils/policy.validator');
const { v4: uuid } = require('uuid');

async function runMiddleware(middleware, args) {
  for (const func of middleware) {
    await func(args);
  }
}

async function extractData(request, response, page, spiders, middleware, store, validator, requestQueue) {
  const preExecution = middleware.preExecution;
  const postExecution = middleware.postExecution;
  const errorHandlers = middleware.errorHandlers;
  // execute spiders if allowed to scrape and 200 status code
  if (validator.isAllowed(request.url) && response.ok()) {
    for (const spider of spiders) {
      const middlewareArgs = {
        request,
        requestQueue,
        store,
        response,
        id: uuid(),
        name: spider.name,
      };
      try {
        const canExtract = await spider.canExtract(request, page);
        if (canExtract) {
          await runMiddleware(preExecution, middlewareArgs);
          middlewareArgs.data = await spider.extractData(request, page);
          await runMiddleware(postExecution, middlewareArgs);
        }
      } catch (e) {
        middlewareArgs.message = e.message;
        await runMiddleware(errorHandlers, middlewareArgs);
      }
    }
  } else {
    const message = !validator.isAllowed(request.url)
      ? 'Website policies prohibit scraping'
      : 'HTTP Request error';
    const middlewareArgs = {
      request,
      response,
      id: uuid(),
      message,
      requestQueue
    };
    await runMiddleware(errorHandlers, middlewareArgs);
  }
}

async function createCrawler(requestQueue, pseudoUrls, config, store) {
  const validator = await getPolicyValidator(config.baseUrl);
  const crawlDelay = validator.getCrawlDelay('*');
  const maxRequestsPerCrawl = getMaxRequestsPerCrawl(config.maxRequestsPerCrawl, crawlDelay);

  const crawlerOptions = {
    requestQueue,
    handlePageFunction: async ({ request, response, page }) => {
      await extractData(request, response, page, config.spiders, config.middleware, store, validator, requestQueue);
      await apify.utils.enqueueLinks({ page, selector: 'a', pseudoUrls, requestQueue });
    },
    maxConcurrency: config.maxConcurrency
  };

  if (maxRequestsPerCrawl) {
    crawlerOptions.maxRequestsPerCrawl = maxRequestsPerCrawl;
  }

  return new apify.PuppeteerCrawler(crawlerOptions);
}

module.exports = {
  createCrawler
};
