export default class DoubleSlider {

  constructor({
    min = 0,
    max = 100,
    formatValue = value => value,
    selected = {
      from: min,
      to: max,
    },
  } = {}) {
    if (max < min || selected.to < selected.from || selected.to > max || selected.from < min) {
      throw "Некорректные параметры";
    }
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
  }

  slider = undefined;
  subElements = undefined;
  currentThumb = undefined;

  get element() {
    if (this.slider === undefined) {
      this.slider = this.render();
    }
    return this.slider;
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointermove', this.pointermove);
    document.removeEventListener('pointerup', this.pointerup);
  }

  remove() {
    this.element.remove();
  }

  render() {
    let rangeSlider = createTag('div', 'class', 'range-slider');

    let rightSpan = createTag('span', 'data-element', 'from');
    rightSpan.innerHTML = this.formatValue(this.selected.from);
    rangeSlider.appendChild(rightSpan);

    let leftShift = ((this.max - this.min) * (this.selected.from - this.min) / 100).toFixed(0);
    let rightShift = ((this.max - this.min) * (this.max - this.selected.to) / 100).toFixed(0);
    let rangeSliderInner = createTag('div', 'class', 'range-slider__inner');
    let rangeSliderProgress = createTag('span', 'class', 'range-slider__progress');
    rangeSliderProgress.setAttribute('style', `left: ${leftShift}%; right: ${rightShift}%`);
    rangeSliderInner.appendChild(rangeSliderProgress);

    let rangeSliderThumbLeft = createTag('span', 'class', 'range-slider__thumb-left');
    rangeSliderThumbLeft.setAttribute('style', `left: ${leftShift}%`);
    rangeSliderThumbLeft.addEventListener('pointerdown', this.pointerdown);
    rangeSliderThumbLeft.addEventListener('pointermove', this.pointermove);
    rangeSliderThumbLeft.addEventListener('pointerup', this.pointerup);
    rangeSliderInner.appendChild(rangeSliderThumbLeft);

    let rangeSliderThumbRight = createTag('span', 'class', 'range-slider__thumb-right');
    rangeSliderThumbRight.setAttribute('style', `right: ${rightShift}%`);
    rangeSliderThumbRight.addEventListener('pointerdown', this.pointerdown);
    rangeSliderThumbRight.addEventListener('pointermove', this.pointermove);
    rangeSliderThumbRight.addEventListener('pointerup', this.pointerup);
    rangeSliderInner.appendChild(rangeSliderThumbRight);

    rangeSlider.appendChild(rangeSliderInner);


    let leftSpan = createTag('span', 'data-element', 'to');
    leftSpan.innerHTML = this.formatValue(this.selected.to);
    rangeSlider.appendChild(leftSpan);

    return rangeSlider;
  }

  getSubElements() {
    let clientRectInner = this.slider.querySelector('.range-slider__inner').getBoundingClientRect();
    let widthInner = clientRectInner.width;
    let leftBoundaryInner = clientRectInner.left;
    let rightBoundaryInner = leftBoundaryInner + widthInner;

    return {
      progress: this.slider.querySelector('.range-slider__progress'),
      leftSpan: this.slider.querySelector('[data-element="from"]'),
      leftThumb: this.slider.querySelector('.range-slider__thumb-left'),
      inner: {
        width: widthInner,
        leftBoundary: leftBoundaryInner,
        rightBoundary: rightBoundaryInner
      },
      rightThumb: this.slider.querySelector('.range-slider__thumb-right'),
      rightSpan: this.slider.querySelector('[data-element="to"]')
    };
  }

  pointerup = (event) => {
    event.preventDefault();
    this.element.dispatchEvent(new CustomEvent("range-select", {
      bubbles: true,
      detail: {
        from: this.selected.from,
        to: this.selected.to
      }
    }));
    this.subElements = undefined;
    this.currentThumb = undefined;
  };

  pointerdown = (event) => {
    event.preventDefault();
    this.subElements = this.getSubElements();
    this.currentThumb = event.target;
    document.addEventListener('pointermove', this.pointermove);
    document.addEventListener('pointerup', this.pointerup);
  };

  pointermove = (event) => {
    event.preventDefault();
    if (this.subElements) {
      if (this.currentThumb === this.subElements.leftThumb) {
        let leftPercent = ((event.clientX - this.subElements.inner.leftBoundary) * 100 / this.subElements.inner.width).toFixed(0);
        this.currentThumb.style.left = leftPercent + "%";
        this.subElements.progress.style.left = leftPercent + "%";

        this.selected.from = Number(this.min) + Number(((this.max - this.min) * leftPercent / 100).toFixed(0));
        this.subElements.leftSpan.innerHTML = this.formatValue(this.selected.from);
      }

      if (this.currentThumb === this.subElements.rightThumb) {
        let rightPercent = Number(((this.subElements.inner.rightBoundary - event.clientX) * 100 / this.subElements.inner.width).toFixed(0));
        this.currentThumb.style.right = rightPercent + "%";
        this.subElements.progress.style.right = rightPercent + "%";

        this.selected.to = Number(this.min) + Number(((this.max - this.min) * (100 - rightPercent) / 100).toFixed(0));
        this.subElements.rightSpan.innerHTML = this.formatValue(this.selected.to);
      }
    }
  };

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
