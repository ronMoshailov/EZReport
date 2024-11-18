import React from 'react';
import PropTypes from 'prop-types';
import './ComponentsModal.scss';

const ComponentsModal = ({ 
  isOpen, 
  onClose, 
  title = 'רשימת רכיבים', 
  placeholder = 'חפש לפי מספר רכיב', 
  components = [], 
  onFilterChange, 
  onRemove 
}) => {
  if (!isOpen) return null; // Only render if modal is open

  return (
    <div className="modal-container-components">
      <div className="modal-components">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Title */}
        <h2>{title}</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
          className="filter-input"
        />

        {/* Components List */}
        <ul>
          {components.map((component, index) => (
            <li key={`component-${component.serialNumber}-${index}`}>
              <button
                className="remove-btn"
                onClick={() => onRemove(component, index)}
              >
                ✕
              </button>
              <b>שם:</b> {component.name} <br />
              <b>מספר רכיב:</b> {component.serialNumber} <br />
              <b>כמות:</b> {component.stock} <br />
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
  title: PropTypes.string,
  placeholder: PropTypes.string,
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
