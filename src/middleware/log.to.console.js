const dayjs = require('dayjs');

// determines when it will be executed during data collection
// pre - executed before data collection
// post - executed after data collection
// error - executed when error occurs
const execType = [ 'pre', 'post', 'error' ];

module.exports = function (config = { execType }) {
  const middlewareFunc = async ({ request, response, data, message, id, name }) => {
    const log = {
      id,
      time: dayjs().format(),
      name,
      data,
      message
    };
    if (request) {
      log.url = request.url;
    }
    if (response) {
      log.status = response.status();
    }
    console.log(log);
  };

  return {
    execType: config.execType ? config.execType : execType,
    middlewareFunc
  };
};
