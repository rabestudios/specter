class CustomStore {
  constructor() {
    this.data = {};
  }

  getValue(key) {
    return this.data[key];
  }

  setValue(key, value) {
    this.data[key] = value;
  }
}

module.exports = CustomStore;
