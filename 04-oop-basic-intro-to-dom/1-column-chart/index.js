export default class ColumnChart {
  constructor(param) {
    if (param) {
      this.data = param.data;
      this.label = param.label;
      this.value = param.value;
      this.link = param.link;
      this.formatHeading = param.formatHeading;
    }
    this.chartHeight = 50;
    this.inner = undefined;
  }

  get element() {
    if (this.inner === undefined) {
      this.inner = this.render();
    }
    return this.inner;
  }

  update(newData) {
    this.data = newData;
  }

  destroy() {
    this.data = null;
    this.label = null;
    this.value = null;
    this.link = null;
    this.inner = undefined;
  }

  remove() {
    this.inner = undefined;
    return null;
  }

  render() {
    const hasData = this.data && this.data.length > 0;
    const maxValue = getMax(this.data);
    const chartCssClass = hasData ? 'column-chart' : 'column-chart column-chart_loading';
    let columnChart = createTag('div', 'class', chartCssClass, 'style', '--chart-height: ' + this.chartHeight);

    let columnChartTitle = createTag('div', 'class', 'column-chart__title');

    columnChartTitle.innerHTML += 'Total ' + this.label;

    if (this.link) {
      let columnChartTitleLink = createTag('a', 'href', this.link, 'class', 'column-chart__link');
      columnChartTitleLink.innerHTML += 'View all';
      columnChartTitle.appendChild(columnChartTitleLink);
    }

    let columnChartContainer = createTag('div', 'class', 'column-chart__container');

    let columnChartHeader = createTag('div', 'data-element', 'header', 'class', 'column-chart__header');
    columnChartHeader.innerHTML += this.value ? (this.formatHeading ? this.formatHeading(this.value) : this.value) : '';

    columnChartContainer.appendChild(columnChartHeader);
    let columnChartChart = createTag('div', 'data-element', 'body', 'class', 'column-chart__chart');

    if (hasData) {
      const scale = this.chartHeight / maxValue;
      this.data.forEach(item => {
        let data = (item * 100 / maxValue).toFixed(0) + '%';
        let value = Math.floor(item * scale);
        columnChartChart.appendChild(createTag('div', 'style', '--value: ' + value, 'data-tooltip', data));
      });
    }

    columnChartContainer.appendChild(columnChartChart);
    columnChart.appendChild(columnChartTitle);
    columnChart.appendChild(columnChartContainer);
    return columnChart;
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

/**
 * Поиск максимального значения в списке
 * @param list
 * @returns {undefined|number}
 */
function getMax(list) {
  if (list) {
    let max = 0;
    list.forEach(el => {
      if (el > max) {
        max = el;
      }
    });
    return max;
  }
  return undefined;
}
