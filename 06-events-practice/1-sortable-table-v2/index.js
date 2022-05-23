export default class SortableTable {
  constructor(headerConfig, {
    data = [],
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = true
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.sortData();
  }

  inner = undefined; // ссылка на всю таблицу
  arrow = undefined; // ссылка на стрелочку

  subElements = {
    header: {
      children: undefined
    },
    body: undefined
  };

  /**
   * Получение таблицы
   * @returns {*}
   */
  get element() {
    if (this.inner === undefined) {
      this.inner = this.render();
    }
    return this.inner;
  }

  destroy() {
    this.headerConfig = undefined;
    this.data = undefined;
    this.remove();
  }

  remove() {
    this.inner && this.inner.remove();
    this.inner = undefined;
    this.subElements = {
      header: {
        children: undefined
      },
      body: undefined
    };
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  sortOnServer() {

  }

  sortOnClient() {
    if (this.headerConfig && this.data && this.sorted.id && this.sorted.order) {
      this.sortData();
      // перерисовка
      let parent = this.inner.parentNode;
      this.remove();
      parent.append(this.element);
    }
  }

  render() {
    if (this.headerConfig === undefined) {
      return null;
    }
    const table = createTag('div', 'class', 'sortable-table');

    // рендеринг шапки
    const tableHeader = createTag('div', 'data-element', 'header', 'class', 'sortable-table__header sortable-table__row');
    if (this.subElements.header.children === undefined) {
      this.renderHeaderRow(tableHeader);
      table.appendChild(tableHeader);
      this.subElements.header.children = tableHeader.children;
    } else {
      tableHeader.children = this.subElements.header.children;
    }

    // рендеринг строк таблицы при наличии данных
    if (this.data) {
      const tableBody = createTag('div', 'date-element', 'body', 'class', 'sortable-table__body"');
      for (let row of this.data) {
        tableBody.appendChild(this.renderBodyRow(row));
      }
      table.appendChild(tableBody);
      this.subElements.body = tableBody;
    }
    return table;
  }

  pointerdown = (event) => {
    this.sorted.id = event.target.getAttribute("data-id");
    this.sorted.order = this.newOrder();
    event.target.setAttribute("data-order", this.sorted.order);
    this.sort();
    event.target.appendChild(this.renderArrow());
  };

  renderHeaderRow(container) {
    for (let columnHeader of this.headerConfig) {
      // отрисовка шапки, data-order добавляется только в случае наличия сортировки
      let headerCell = createTag('div', 'class', 'sortable-table__cell', 'data-id', columnHeader.id,
        'data-sortable', columnHeader.sortable);

      let headerTitle = createTag('span');
      headerTitle.innerHTML += columnHeader.title;
      headerCell.appendChild(headerTitle);

      if (columnHeader.sortable) {
        headerCell.addEventListener('pointerdown', this.pointerdown);
      }

      // пиктограмма сортировки
      if (this.sorted.id === columnHeader.id) {
        headerCell.setAttribute('data-order', this.sorted.order);
        headerCell.appendChild(this.renderArrow());
      }
      container.appendChild(headerCell);
    }
  }

  renderBodyRow(rowData) {
    let a = createTag('a', 'href', '#', 'class', 'sortable-table__row');
    for (let columnHeader of this.headerConfig) {
      if (columnHeader.template) {
        // добавление данных согласно функции-шаблону
        a.innerHTML += columnHeader.template(rowData);
      } else {
        let cell = createTag('div', 'class', 'sortable-table__cell');
        // добавление данных по наименованию колонки
        cell.innerHTML += rowData[columnHeader.id];
        a.appendChild(cell);
      }
    }
    return a;
  }

  renderArrow() {
    let tableSortArrow = createTag('span', 'data-element', 'arrow', 'class', 'sortable-table__sort-arrow');
    tableSortArrow.appendChild(createTag('span', 'class', 'sort-arrow'));
    return tableSortArrow;
  }

  sortData() {
    // проверим наличие колонки для фильтрации
    let sortingField = this.headerConfig.find(el => el.id === this.sorted.id && el.sortable);
    if (sortingField === undefined) {
      alert('Не найдена столбец для фильтрации или данные по столбцу не могут быть отсортирована');
    }

    // формируем коэффициент сортирофки для управления направленности сортировки
    let coef = this.sorted.order === 'asc' ? 1 : (this.sorted.order === 'desc' ? -1 : alert('Некорректное значение типа сортировки asc/desc'));

    // сортировка
    this.data = this.data.sort((a, b) => {
      if (sortingField.sortType === 'string') {
        return coef * (a[this.sorted.id].localeCompare(b[this.sorted.id], 'ru'));
      } else if (sortingField.sortType === 'number') {
        return coef * (a[this.sorted.id] - b[this.sorted.id]);
      }
    });
  }

  newOrder() {
    if (this.sorted.order === 'asc') {
      return 'desc';
    } else if (this.sorted.order === 'desc') {
      return 'asc';
    } else {
      return this.sorted.order;
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
