const CustomStore = require('./custom.store');

exports.getCustomStore = () => {
  return new CustomStore();
};
