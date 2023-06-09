import Adapt from "core/js/adapt";
import QuestionView from "core/js/views/questionView";

import DraggieView from "./draggieView";
class dragToPositionView extends QuestionView {
  preinitialize() {
    this.draggies = [];
  }

  initialize(...args) {
    _.bindAll(this, "onDropIt");
    super.initialize(...args);
  }

  setupQuestion() {
    this.listenToOnce(Adapt.parentView, "postRemove", this.onPostRemove);
    this.listenTo(Adapt, {
      "device:changed device:resize": this.onResize,
    });
  }

  onPostRemove() {
    this.draggies.forEach((draggie) => {
      draggie.off("dropIt", this.onDropIt);
      draggie.destroy();
    });
  }

  disableQuestion() {
    this.draggies.forEach((draggie) => draggie.toggleDisabled(true));
  }

  enableQuestion() {
    this.draggies.forEach((draggie) => draggie.toggleDisabled(false));
  }

  onQuestionRendered() {
    this.$(".component__widget").imageready(() => {
      this.setupItems();
      this.setSizeDrop();
      this.setReadyStatus();
    });
  }

  setSizeDrop() {
    const $target = this.$(".dropitems__dropzone");
    const $container = this.$(".dropitems__container");
    $target.css({
      "min-width": `${$container.outerWidth()}px`,
      "min-height": `${$container.outerHeight()}px`,
    });
  }

  onResize() {
    this.setPosition();

    this.setSizeDrop();
  }

  setPosition() {
    this.draggies.forEach((draggie) => {
      if (draggie.model.get("_isActive")) {
        draggie.setPositionTarget();
      } else {
        draggie.resetPosition();
      }
    });
  }

  setupItems() {
    const $container = this.$(".component__inner");
    const items = this.model.getChildren();

    const target = this.$(".dropitems__dropzone");
    this.$(".dropitems__item").each((i, el) => {
      const item = items.models[i];
      const draggie = new DraggieView({
        el: $(el),
        target: target,
        container: $container,
        model: item,
      });
      this.draggies.push(draggie);
      draggie.on("dropIt", this.onDropIt);
    });

    this.enableQuestion();
    if (this.model.get("_isEnabled") !== true) {
      this.disableQuestion();
      this.setPosition();
    }
  }

  checkPositions() {
    const positions = this.draggies.map((draggie) => {
      return {
        item: draggie.model.get("_index"),
        position: draggie.getRelativePosition(),
      };
    });
    return positions;
  }

  onDropIt(draggie, value, droppedPosition) {
    if (!this.model.isInteractive()) return;
    const itemIndex = draggie.model.get("_index");
    const itemModel = this.model.getItem(itemIndex);
    const correctPosition = itemModel.get("expectedPositions")[0];
    droppedPosition.x = Math.round(droppedPosition.x * 10) / 10;
    droppedPosition.y = Math.round(droppedPosition.y * 10) / 10;
    const isCorrectlyPlaced = this.checkPosition(
      droppedPosition,
      correctPosition
    );
    itemModel.toggleActive(isCorrectlyPlaced);
    this.checkAllItemsPlacedCorrectly();
  }

  checkAllItemsPlacedCorrectly() {
    const allItemsPlacedCorrectly = this.draggies.every((draggie) => {
      const droppedPosition = draggie.getRelativePosition();
      const itemIndex = draggie.model.get("_index");
      const itemModel = this.model.getItem(itemIndex);
      const correctPosition = itemModel.get("expectedPositions")[0];
      return this.checkPosition(droppedPosition, correctPosition);
    });

    if (allItemsPlacedCorrectly) {
      this.model.set("_isAtLeastOneCorrectSelection", true); // Assuming this property exists in your model
    } else {
      this.model.set("_isAtLeastOneCorrectSelection", false);
    }
  }

  checkPosition(droppedPosition, expectedPosition, tolerance = 0.1) {
    return (
      Math.abs(droppedPosition.x - expectedPosition.x) <= tolerance &&
      Math.abs(droppedPosition.y - expectedPosition.y) <= tolerance
    );
  }

  resetQuestion() {
    this.model.resetItems();
    this.setPosition();
  }

  showCorrectAnswer() {
    this.draggies.forEach((draggie) => {
      // if (draggie.model.get("_shouldBeSelected")) {
      //   draggie.setPositionTarget();
      // } else {
      //   draggie.resetPosition();
      // }
      $(draggie.el).animate({ opacity: 0 });
      // fade in my answer
    });
    this.model.set("_isCorrectAnswerShown", true);
  }

  hideCorrectAnswer() {
    if (!this.draggies[0]) return;
    this.model.get("_userAnswer").forEach((answer, index) => {
      $(this.draggies[index].el).animate({ opacity: 1 });
    });
    this.model.set("_isCorrectAnswerShown", false);
  }
}
dragToPositionView.template = "drag-to-position.jsx";

export default dragToPositionView;
