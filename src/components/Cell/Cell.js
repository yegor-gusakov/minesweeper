import React, { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Cell.scss';
import { EMPTY, MINE } from '../../constants/cells';
import {
  CLOSED,
  EXPLODED,
  FLAGGED,
  OPENED,
  SUSPICIOUS
} from '../../constants/states';

const Cell = ({ itemState, onItemClick, onItemToggleFlag, type }) => {
  /**
   * Returns the classname by state
   * @return {string}
   */
  const getClassNameByState = itemState => {
    const prefix = 'item--';

    switch (itemState) {
      case OPENED:
        return prefix + 'opened';
      case EXPLODED:
        return prefix + 'exploded';
      case CLOSED:
        return prefix + 'closed';
      case SUSPICIOUS:
        return prefix + 'closed ' + prefix + 'suspicious';
      case FLAGGED:
        return prefix + 'closed ' + prefix + 'flagged';
      // Fallback is CLOSED
      default:
        return prefix + 'closed';
    }
  };

  /**
   * Returns class name by cell type
   * @return {string}
   */
  const getClassNameByType = type => {
    if (type >= 1 && type <= 8) {
      return 'item--' + type;
    }

    return '';
  };

  /**
   * Creates a content for the item
   * @return {string}
   */
  const getItemContentByType = type => {
    switch (type) {
      case MINE:
        return '💣';
      case EMPTY:
        return '';
      // As fallback returns numbers
      default:
        return type;
    }
  };

  /**
   * Handles right click on cell
   */
  const onToggleFlag = useCallback(event => {
    event.preventDefault();

    if (typeof onItemToggleFlag === 'function') {
      onItemToggleFlag(event);
    }
  }, [onItemToggleFlag]);

  const itemElement = useRef(null);
  const content = getItemContentByType(type);
  const classList = classNames(
    'item',
    getClassNameByState(itemState),
    getClassNameByType(type)
  );

  useEffect(() => {
    const cell = itemElement;
    cell.current.addEventListener('contextmenu', onToggleFlag);

    return () => {
      cell.current.removeEventListener('contextmenu', onToggleFlag);
    };
  }, [onToggleFlag]);

  return (
    <div
      className={classList}
      onClick={onItemClick}
      ref={itemElement}
    >
      <span className="item__content">{content}</span>
    </div>
  );
};

Cell.propTypes = {
  itemState: PropTypes.number.isRequired,
  onItemClick: PropTypes.func.isRequired,
  onItemToggleFlag: PropTypes.func.isRequired,
  type: PropTypes.number.isRequired
};

Cell.defaultProps = {
  itemState: null,
  onItemClick: () => {},
  onItemToggleFlag: () => {},
  type: null
};

export default Cell;
