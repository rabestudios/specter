// determines when it will be executed during data collection
// pre - executed before data collection
// post - executed after data collection
// error - executed when error occurs
const execType = [ 'post' ];

async function writeToStore(keyProp, store, data) {
  const key = data[keyProp];
  if (key) {
    const value = store.getValue(key);
    if (value) {
      const newData = { ...value, ...data };
      await store.setValue(key, newData);
    } else {
      await store.setValue(key, data);
    }
  }
}

module.exports = function (config = { execType }) {
  const { keyProp } = config;
  if (!keyProp) {
    throw new Error('Missing keyProp in write.to.store middleware');
  }

  const middlewareFunc = async ({ data, store }) => {
    if (store && data) {
      if (Array.isArray(data)) {
        for(const item of data) {
          await writeToStore(keyProp, store, item);
        }
      } else {
        await writeToStore(keyProp, store, data);
      }
    }
  };

  return {
    execType: config.execType ? config.execType : execType,
    middlewareFunc
  };
};
