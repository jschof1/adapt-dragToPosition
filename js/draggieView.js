import Draggabilly from '../libraries/draggabilly';

class DraggieView extends Backbone.View {

  initialize(settings) {
    _.bindAll(this, 'onDragStart', 'onDragMove', 'onDragEnd');
    this.settings = _.defaults(settings, DraggieView.defaults);
    this.draggie = null;
    this.setUpDraggie();
    this.addEventListeners();
    this.settings.load.call(this, this);
    this.trigger('load', this);
  }

  setUpDraggie() {
    this.draggie = new Draggabilly(this.settings.el[0], this.settings.container);
  }

  addEventListeners() {
    this.draggie.on('dragStart', this.onDragStart);
    this.draggie.on('dragMove', this.onDragMove);
    this.draggie.on('dragEnd', this.onDragEnd);
  }

  onDragStart() {
    // console.log('start');
  }

  onDragMove(event, pointer) {
    if (this.isOverlap(pointer)) {
      this.settings.target.addClass('is-active');
    } else {
      this.settings.target.removeClass('is-active');
    }

  }

  onDragEnd(event, pointer) {
    const _isOverlap = this.isOverlap(pointer);
    if (_isOverlap) {
      this.setPositionTarget();
    } else {
      this.resetPosition();

    }
    this.trigger('dropIt', this, _isOverlap);
    this.settings.target.removeClass('is-active');
  }

  setPositionTarget() {
    const targetPosition = this.settings.target.position();
    // allow to set anywhere in the target
    return targetPosition;
  }

  resetPosition() {
    this.setPosition(0, 0);
  }

  setPosition(top, left) {
    const el = this.settings.el;
    el.animate({ top: `${top}px`, left: `${left}px` });
  }

  isOverlap(pointer) {
    const targetLocation = this.settings.target[0].getBoundingClientRect();

    const targetX = targetLocation.left + targetLocation.width;
    const targetY = targetLocation.top + targetLocation.height;
    const x = pointer.x;
    const y = pointer.y;

    if (x >= targetLocation.left && x <= targetX &&
        y >= targetLocation.top && y <= targetY) {
      return true;
    } else {
      return false;
    }
  }

  toggleDisabled(value) {
    if (!this.draggie) return;
    if (!value) {
      this.draggie.enable();
    } else {
      this.draggie.disable();
    }
  }

  destroy() {
    this.draggie.destroy();
  }
}

DraggieView.defaults = {

  load() {}
};
export default DraggieView;
