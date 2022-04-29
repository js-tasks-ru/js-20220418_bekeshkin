/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (obj === undefined) {
    return obj;
  }
  let invertObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    invertObj[value] = key; // меняем местами ключ и значение для нового объекта
  });
  return invertObj;
}
