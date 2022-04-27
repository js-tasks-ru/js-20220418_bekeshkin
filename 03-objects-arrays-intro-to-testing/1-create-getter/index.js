/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function (obj) {
    return getValue(obj, path);
  };
}

/**
 * Рекурсия для получения свойств с учетом вложенности
 * @param obj - объект
 * @param path - путь до конечного свойства
 *              'name1.name2.name3',где 'name3' - конечное свойство,
 * @returns {*|undefined}
 */
function getValue(obj, path) {
  // если объект неопределен, возвращаем его
  if (obj === undefined) {
    return obj;
  }
  // определяем корневое  в объекте и остальной путь для конечного свойства
  let index = path.indexOf('.');
  let propValue;
  let otherPath;
  if (index > 0) {
    propValue = path.substring(0, path.indexOf('.')); // пример: 'name1'
    otherPath = path.substring(path.indexOf('.') + 1); // пример: 'name2.name3'
  } else {
    propValue = path;
  }

  // если остальной путь отсутствует (дошли до конечного свойства)
  if (otherPath === undefined) {
    // то возвращаем значение конечного свойства
    return obj[propValue];
  } else {
    // иначе ищем дальше в объекте, который располагается в корневом свойстве
    return getValue(obj[propValue], otherPath);
  }
}
