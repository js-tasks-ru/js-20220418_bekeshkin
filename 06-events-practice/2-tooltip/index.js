class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  inner = undefined;

  pointerOver = (event) => {
    if (event.target.dataset.tooltip !== undefined) {
      this.render(event.target.dataset.tooltip);
    }
  };

  pointerOut = (event) => {
    this.remove();
  };

  initialize() {
    document.addEventListener('pointerover', this.pointerOver);
    document.addEventListener('pointerout', this.pointerOut);
  }

  get element() {
    return this.inner;
  }

  remove() {
    if (this.inner) {
      this.inner.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.pointerOver);
    document.removeEventListener('pointerout', this.pointerOut);
    this.remove();
    this.inner = null;
  }

  render(text) {
    this.inner = document.createElement('div');
    this.inner.className = 'tooltip';
    this.inner.innerHTML += text;
    document.body.appendChild(this.inner);
  }
}

export default Tooltip;
