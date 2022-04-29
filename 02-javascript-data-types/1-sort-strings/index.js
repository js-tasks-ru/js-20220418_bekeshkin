/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let sortingArray = [...arr];
  let multiplier = param === 'asc' ? 1 : (param === 'desc' ? -1 : alert('Некорректное значение типа сортировки asc/desc'));
  return sortingArray.sort((a, b) => multiplier * a.localeCompare(b, 'ru', {caseFirst: 'upper'}));
}
