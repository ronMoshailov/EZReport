import React, { useState, useEffect } from 'react';
import './newStorageReport.scss'

const ComponentPage = () => {
  const [allComponents, setAllComponents] = useState([]); // Left side list
  const [myComponents, setMyComponents] = useState([]); // Left side list
  const [inputId, setInputId] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputCount, setInputCount] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const getComponentByNameOrId = (identifier) => {
    return allComponents.find(comp => 
      comp.component_name === identifier || comp.component_num === identifier
    );
  };
  
  // Fetch all components from MongoDB on initial render
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/components');
        const data = await response.json();
        // console.log(`components that return from server after .json(): ` + data);
        setAllComponents(data);
      } catch (err) {
        console.error('Failed to fetch components', err);
      }
    };
    fetchComponents();
  }, []);

  // Handle add button click
  const handleAddComponent = async () => {
    try {
      if((inputId === '' &&  inputCount === '') || (inputName === '' &&  inputCount === '') || inputCount === ''){
        setError('נתונים חסרים');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/components/${inputId}`);
      if (!response.ok) throw new Error('Component not found');
      const data = await response.json();

      // Check if the component already exists in the list
      console.log('inputId: ' + data);
      const existingComponent = getComponentByNameOrId(data.component_num);

      // Add new component to the list
      console.log('existingComponent: ' + existingComponent);
      const newComponent = { id: existingComponent.component_num, name: existingComponent.component_name, count: existingComponent.component_count };
      setMyComponents(prevComponents => [...prevComponents, newComponent]);

      // Clear input fields
      setInputId('');
      setInputName('');
      setInputCount('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="component-page">
      
      <div className="left-panel">
        <h2 className='move_right border_bottom'>רשימת הרכיבים</h2>
        <ul>
        {myComponents.map((comp, index) => (
        <li key={`myComp-${comp.id}-${index}`}>
          <b>שם:</b> {comp.name} <br />
          <b>מספר רכיב:</b> {comp.id}<br />
          <b>כמות:</b> {comp.count}
        </li>
      ))}
        </ul>
      </div>

      <div className="right-panel">
        <h2 className='move_right border_bottom'>הוספת רכיב</h2>
        <div className="input-group">
          <label>:מספר רכיב</label>
          <input
            type="number"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="הכנס מספר רכיב..."
          />
        </div>
        <div className="input-group">
          <label>:שם</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="הכנס שם רכיב"
          />
        </div>
        <div className="input-group">
          <label>:כמות</label>
          <input
            type="number"
            value={inputCount}
            onChange={(e) => setInputCount(e.target.value)}
            placeholder="הכנס כמות"
          />
        </div>
        <div id='storange_buttons_container'>
          <button className='storage_button' onClick={handleAddComponent}>הוסף רכיב</button>
          <button className='storage_button'>שלח דיווח</button>
        </div>
        {error && <p className="error">{error}</p>}

        <div className="all_components">
        <h2 className='move_right border_bottom'>כל הרכיבים במערכת</h2>
        <ul>
        {allComponents.map((comp, index) => (
        <li key={`${index}`}>
          <b>שם:</b> {comp.component_name} <br />
          <b>מספר רכיב:</b> {comp.component_num}<br />
          <b>כמות:</b> {comp.component_count}
        </li>
      ))}
        </ul>
      </div>

      </div>
    </div>
  );
};

export default ComponentPage;
