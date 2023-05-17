import Adapt from 'core/js/adapt';
import DropItemsView from './dropItemsView';
import DropItemsModel from './dropItemsModel';

export default Adapt.register('dropItems', {
  view: DropItemsView,
  model: DropItemsModel
});
