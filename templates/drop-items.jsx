// import Adapt from 'core/js/adapt';
import React from 'react';
import { templates, classes, html, compile } from 'core/js/reactHelpers';

export default function DropItems(props) {
  // const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _id,
    _isEnabled,
    _isInteractionComplete,
    _isCorrect,
    _isCorrectAnswerShown,
    _canShowMarking,
    displayTitle,
    body,
    _graphic,
    instruction,
    isInteractive

  } = props;
  const shouldShowMarking = !isInteractive() && _canShowMarking;
  return (
    <div className='component__inner dropitems__inner'>
      <templates.header {...props} />

      <div
        className={classes([
          'component__widget',
          'dropitems__widget',
          !_isEnabled && 'is-disabled',
          _isInteractionComplete && 'is-complete is-submitted show-user-answer',
          _isCorrect && 'is-correct'
        ])}
        role='section'
        aria-labelledby={
          (displayTitle || body || instruction) && `${_id}-header`
        }>

        <div className='dropitems__container'>
          {props._items.map(({ _index, title, body, _graphic, _shouldBeSelected, _isActive }, index) => (
            <div
              className={classes([
                `dropitems__item dropitems__item-${index}`,
                (_isCorrectAnswerShown ? _shouldBeSelected : _isActive) && 'is-selected',
                shouldShowMarking && _shouldBeSelected && 'is-correct',
                shouldShowMarking && !_shouldBeSelected && 'is-incorrect'
              ])}
              key={_index}
            >
              <div
                className={classes([
                  'dropitems__item-state'

                ])}
              >
                <div className='icon'></div>
              </div>
              {_graphic &&
              <templates.image {..._graphic}
                classNamePrefixes={['dropitems__item-graphic']}
                attributionClassNamePrefixes={['component', 'dropitems']}
              />
              }
              {
                title &&
            <div className='dropitems__item-title'>
              {html(compile(title))}
            </div>
              }
              {
                body &&
            <div className='dropitems__item-title'>
              {html(compile(body))}
            </div>
              }

            </div>
          )
          )}
        </div>
        <div className='dropitems__dropzone'>
          <div className='dropitems__dropzone-inner'>
            {_graphic &&
            <templates.image {..._graphic}
              classNamePrefixes={['dropitems__item-graphic']}
              attributionClassNamePrefixes={['component', 'dropitems']}
            />
            }
          </div>
        </div>
      </div>

      <div className='btn__container'></div>
    </div>
  );
}
