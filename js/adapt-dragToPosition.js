import Adapt from 'core/js/adapt';
import dragToPositionView from './dragToPositionView';
import dragToPositionModel from './dragToPositionModel';

export default Adapt.register('dragToPosition', {
  view: dragToPositionView,
  model: dragToPositionModel
});
