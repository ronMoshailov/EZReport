import React, { useState, useContext} from 'react';
import PropTypes from 'prop-types';
import './ComponentsModal.scss';

import { LanguageContext } from '../../../utils/globalStates';

const ComponentsModal = ({ isOpen, onClose, components = [], onRemove }) => {

  const [filterText, setFilterText] = useState('');

  const { text } = useContext(LanguageContext);

  if (!isOpen) return null;

  const filteredComponents = components.filter((comp) =>
    comp.serialNumber.toString().includes(filterText) ||
    comp.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="modal-container-components">
      <div className="modal-components">
        
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{text.componentList}</h2>
        <input
          type="text"
          placeholder={`${text.filterByComponentNum}...`}
          onChange={(e) => setFilterText(e.target.value)}
          value={filterText}
          className="search-bar"
        />

        {/* Components List */}
        <ul>
          {filteredComponents.map((component, index) => (
            <li key={`component-${component.serialNumber}-${index}`}>
              <button
                className="remove-btn"
                onClick={() => onRemove(component)}
              >
                ✕
              </button>
              <b>{text.name}:</b> {component.name} <br />
              <b>{text.componentNum}:</b> {component.serialNumber} <br />
              <b>{text.quantity}:</b> {component.stock} <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// PropTypes for validation
ComponentsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  components: PropTypes.arrayOf(
    PropTypes.shape({
      serialNumber: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      stock: PropTypes.number.isRequired,
    })
  ),
  onFilterChange: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
};

export default ComponentsModal;
