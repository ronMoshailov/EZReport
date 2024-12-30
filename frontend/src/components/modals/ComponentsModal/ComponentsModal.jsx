// Import react libraries
import React, { useState, useContext} from 'react';

// Import scss
import './ComponentsModal.scss';

// Import context
import { LanguageContext } from '../../../utils/languageProvider';

// ComponentsModal component
const ComponentsModal = ({ isOpen, onClose, components = [], onRemove }) => {

  // use State
  const [filterText, setFilterText] = useState('');

  // useContext
  const { direction, text } = useContext(LanguageContext);

  // Style
  const directionStyle = () => ({
    textAlign: direction === 'rtl' ? 'right' : 'left',
  })

  const buttonDirectionStyle = () => ({
    textAlign: direction === 'rtl' ? 'left' : 'right',
    [direction === 'rtl' ? 'left' : 'right']: '10px',
  })
  
  // Check if the modal already open
  if (!isOpen) 
    return null;

  // Components after the filter
  const filteredComponents = components.filter((comp) =>
    comp.serialNumber.toString().includes(filterText) ||
    comp.name.toLowerCase().includes(filterText.toLowerCase())
  );

  // Render
  return (
    <div className="modal-container-components">
      <div className="modal-components">
        
        <button className="close-btn" onClick={onClose} style={{float: direction === 'rtl' ? 'left' : 'right'}}>✕</button>
        <h2 style={{textAlign: direction === 'ltr' ? 'left' : 'right'}}>{text.componentList}</h2>
        <input
          type="text"
          placeholder={`${text.filterByComponentNum}...`}
          onChange={(e) => setFilterText(e.target.value)}
          value={filterText}
          className="search-bar"
          style={{direction}}
        />

        {/* Components List */}
        <ul>
          {filteredComponents.map((component, index) => (
            <li key={`component-${component.serialNumber}-${index}`} style={directionStyle()}>
              <button
                className="remove-btn"
                onClick={() => onRemove(component)}
                style={buttonDirectionStyle()}
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

// Export component
export default ComponentsModal;
