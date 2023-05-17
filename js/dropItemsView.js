
import Adapt from 'core/js/adapt';
import QuestionView from 'core/js/views/questionView';

import DraggieView from './draggieView';
class DropItemsView extends QuestionView {

  preinitialize() {
    this.draggies = [];
  }

  initialize(...args) {
    _.bindAll(this, 'onDropIt');
    super.initialize(...args);
  }

  setupQuestion() {
    this.listenToOnce(Adapt.parentView, 'postRemove', this.onPostRemove);
    this.listenTo(Adapt, {
      'device:changed device:resize': this.onResize

    });
  }

  onPostRemove() {
    this.draggies.forEach(draggie => {
      draggie.off('dropIt', this.onDropIt);
      draggie.destroy();
    });
  }

  disableQuestion() {
    this.draggies.forEach(draggie => draggie.toggleDisabled(true));

  }

  enableQuestion() {
    this.draggies.forEach(draggie => draggie.toggleDisabled(false));
  }

  onQuestionRendered() {
    this.$('.component__widget').imageready(() => {
      this.setupItems();
      this.setSizeDrop();
      this.setReadyStatus();
    }
    );

  }

  setSizeDrop() {
    const $target = this.$('.dropitems__dropzone');
    const $container = this.$('.dropitems__container');
    $target.css({ 'min-width': `${$container.outerWidth()}px`, 'min-height': `${$container.outerHeight()}px` });
  }

  onResize() {

    this.setPosition();

    this.setSizeDrop();
  }

  setPosition() {
    this.draggies.forEach(draggie => {
      if (draggie.model.get('_isActive')) {
        draggie.setPositionTarget();
      } else {
        draggie.resetPosition();
      }
    });
  }

  setupItems() {

    const $container = this.$('.component__inner');
    const items = this.model.getChildren();

    const target = this.$('.dropitems__dropzone');
    this.$('.dropitems__item').each((i, el) => {

      const item = items.models[i];
      const draggie = new DraggieView({ el: $(el), target: target, container: $container, model: item });
      this.draggies.push(draggie);
      draggie.on('dropIt', this.onDropIt);
    });

    this.enableQuestion();
    if (this.model.get('_isEnabled') !== true) {
      this.disableQuestion();
      this.setPosition();
    }
  }

  onDropIt(draggie, value) {

    if (!this.model.isInteractive()) return;
    const itemIndex = draggie.model.get('_index');
    const itemModel = this.model.getItem(itemIndex);

    itemModel.toggleActive(value);

  }

  resetQuestion() {
    this.model.resetItems();
    this.setPosition();
  }

  showCorrectAnswer() {

    this.draggies.forEach(draggie => {
      if (draggie.model.get('_shouldBeSelected')) {
        draggie.setPositionTarget();
      } else {
        draggie.resetPosition();
      }
    });
    this.model.set('_isCorrectAnswerShown', true);
  }

  hideCorrectAnswer() {
    if (!this.draggies[0]) return;
    this.model.get('_userAnswer').forEach((answer, index) => {
      if (answer) {
        this.draggies[index].setPositionTarget();
      } else {
        this.draggies[index].resetPosition();
      }
    });
    this.model.set('_isCorrectAnswerShown', false);
  }

}
DropItemsView.template = 'drop-items.jsx';

export default DropItemsView;
