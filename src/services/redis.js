import singleton from "../utils/singleton";

const cache = {};

function Redis() {
  function get(key) {
    return Promise.resolve(cache[key]);
  }

  function set(key, val) {
    cache[key] = val;
    return val;
  }

  return {
    get,
    set,
  };
}

export default singleton(Redis);
