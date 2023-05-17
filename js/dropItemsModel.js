import ItemsQuestionModel from 'core/js/models/itemsQuestionModel';

export default class DropItemsModel extends ItemsQuestionModel {
  defaults() {
    return ItemsQuestionModel.resultExtend('defaults', {
      _selectable: this.getChildren().models.length
    });
  }

}
