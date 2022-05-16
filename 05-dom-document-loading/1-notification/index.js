export default class NotificationMessage {
  constructor(text = '', param = {duration: 10, type: 'success'}, btn) {
    this.text = text;
    this.duration = param.duration;
    this.type = param.type;
  }

  inner = undefined;

  static activeNotification;

  get element() {
    if (this.inner === undefined) {
      this.inner = this.render();
    }
    return this.inner;
  }

  show(parent = document.body) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }
    NotificationMessage.activeNotification = this.element;
    parent.appendChild(this.element);
    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  destroy() {
    this.text = undefined;
    this.duration = undefined;
    this.type = undefined;
    this.remove();
  }

  remove() {
    this.inner && this.inner.remove();
  }

  render() {
    const notificationBlock = createTag('div', 'class', 'notification ' + this.type,
      'style', '--value:' + (this.duration / 1000) + 's');

    const timerBlock = createTag('div', 'class', 'timer');
    notificationBlock.appendChild(timerBlock);

    const innerWrapperBlock = createTag('div', 'class', 'inner-wrapper');
    notificationBlock.appendChild(innerWrapperBlock);

    const notificationHeaderBlock = createTag('div', 'class', 'notification-header');
    notificationHeaderBlock.innerHTML += this.type;
    innerWrapperBlock.appendChild(notificationHeaderBlock);

    const notificationBodyBlock = createTag('div', 'class', 'notification-body');
    notificationBodyBlock.innerHTML = this.text;
    innerWrapperBlock.appendChild(notificationBodyBlock);

    return notificationBlock;
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
