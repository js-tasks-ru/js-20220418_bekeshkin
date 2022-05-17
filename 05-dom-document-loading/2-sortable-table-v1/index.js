export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
  }

  inner = undefined; // ссылка на всю таблицу
  body = undefined; // ссылка на список строк
  sortedField = undefined; // текущее поле сортировки
  sortedOrder = undefined; // текущая сортировка

  get element() {
    if (this.inner === undefined) {
      this.inner = this.render();
    }
    return this.inner;
  }

  get subElements() {
    return {
      body: this.body
    };
  }

  destroy() {
    this.headerConfig = undefined;
    this.data = undefined;
    this.remove();
  }

  remove() {
    this.inner && this.inner.remove();
    this.inner = undefined;
    this.body = undefined;
  }

  render() {
    if (this.headerConfig === undefined) {
      return null;
    }
    const table = createTag('div', 'class', 'sortable-table');

    // рендеринг шапки таблицы
    const tableHeader = createTag('div', 'data-element', 'header', 'class', 'sortable-table__header sortable-table__row');
    table.appendChild(tableHeader);

    for (let columnHeader of this.headerConfig) {
      // отрисовка шапки, data-order добавляется только в случае наличия сортировки
      let tableCell = createTag('div', 'class', 'sortable-table__cell', 'data-id', columnHeader.id,
        'data-sortable', columnHeader.sortable, this.sortedOrder && 'data-order', this.sortedOrder);
      let titleSpan = createTag('span');
      titleSpan.innerHTML += columnHeader.title;
      tableCell.appendChild(titleSpan);

      // пиктограмма сортировки
      if (this.sortedOrder && this.sortedField && this.sortedField === columnHeader.id) {
        let tableSortArrow = createTag('div', 'data-element', 'arrow', 'class', 'sortable-table__sort-arrow');
        tableSortArrow.appendChild(createTag('span', 'class', 'sort-arrow'));
        tableCell.appendChild(tableSortArrow);
      }
      tableHeader.appendChild(tableCell);
    }

    // рендеринг строк таблицы при наличии данных
    if (this.data) {
      const tableBody = createTag('div', 'date-element', 'body', 'class', 'sortable-table__body"');
      for (let row of this.data) {
        let a = createTag('a', 'href', '#', 'class', 'sortable-table__row');
        for (let columnHeader of this.headerConfig) {
          if (columnHeader.template) {

            // добавление данных согласно функции-шаблону
            a.innerHTML += columnHeader.template(row);
          } else {
            let cell = createTag('div', 'class', 'sortable-table__cell');

            // добавление данных по наименованию колонки
            cell.innerHTML += row[columnHeader.id];
            a.appendChild(cell);
          }
        }
        tableBody.appendChild(a);
      }
      table.appendChild(tableBody);
      this.body = tableBody;
    }
    return table;
  }

  /**
   * Сортировка таблицы
   * @param fieldValue - сортируемое поле
   * @param orderValue - порядок сортировки
   */
  sort(fieldValue, orderValue) {
    this.sortedField = fieldValue;
    this.sortedOrder = orderValue;


    if (this.headerConfig && this.data && this.sortedField && this.sortedOrder) {
      // проверим наличие колонки для фильтрации
      let sortingField = this.headerConfig.find(el => el.id === this.sortedField && el.sortable);
      if (sortingField === undefined) {
        alert('Не найдена столбец для фильтрации или данные по столбцу не могут быть отсортирована');
      }

      // формируем коэффициент сортирофки
      let coef = this.sortedOrder === 'asc' ? 1 : (this.sortedOrder === 'desc' ? -1 : alert('Некорректное значение типа сортировки asc/desc'));

      // сортировка
      this.data = this.data.sort((a, b) => {
        if (sortingField.sortType === 'string') {
          return coef * (a[this.sortedField].localeCompare(b[this.sortedField], 'ru'));
        } else if (sortingField.sortType === 'number') {
          return coef * (a[this.sortedField] - b[this.sortedField]);
        }
      });

      // перерисовка
      let parent = this.inner.parentNode;
      this.remove();
      parent.append(this.element);
    }
  }
}

/**
 * Саздание html тэга
 * @param tagName имя тега
 * @param attributes список атрибутов, значений через запятую
 * @returns {*}
 */
function createTag(tagName, ...attributes) {
  let tag = document.createElement(tagName);
  let i = 0;
  while (i < attributes.length) {
    tag.setAttribute(attributes[i], attributes[i + 1]);
    i += 2;
  }
  return tag;
}
