const usedNames = {};

export default function (Constructor) {
  if (usedNames[Constructor.name]) {
    throw `singleton ERROR the name ${Constructor.name} is already in use`;
  }
  usedNames[Constructor.name] = true;

  const ID = Symbol(Constructor.name);
  const getInstance = () => global[ID] || (global[ID] = new Constructor());

  const handler = {
    get: function (_, name) {
      // console.log('proxy target', Constructor.name, 'name', name);
      const instance = getInstance();

      if (process.env.NODE_ENV === "test") {
        return instance;
      }

      if (instance[name]) return instance[name];
      throw new Error(
        `Proxy access error: ${Constructor.name} has no method ${name}`
      );
    },
  };

  return new Proxy({}, handler);
}
