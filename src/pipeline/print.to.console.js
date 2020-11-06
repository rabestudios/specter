/**
 * Prints any data to console
 * @param data
 * @returns {Promise<void>}
 */
async function apply(data) {
  console.log(data);
}

function getRequiredConfig() {
  return [];
}

module.exports = {
  apply,
  getRequiredConfig
};
