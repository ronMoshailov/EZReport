import React, { useState, useEffect } from 'react';
import './NewReportPage.scss'

const ComponentPage = () => {
  const [components, setComponents] = useState([]); // Left side list
  const [inputId, setInputId] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputCount, setInputCount] = useState('');
  const [error, setError] = useState('');

  // Fetch all components from MongoDB on initial render
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/components');
        const data = await response.json();
        setComponents(data);
      } catch (err) {
        console.error('Failed to fetch components', err);
      }
    };
    fetchComponents();
  }, []);

  // Handle add button click
  const handleAddComponent = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/components/${inputId}`);
      if (!response.ok) throw new Error('Component not found');

      // Check if the component already exists in the list
      const existingComponent = components.find(comp => comp.id === inputId);
      if (existingComponent) {
        setError('Component already exists in the list');
        return;
      }

      // Add new component to the list
      const newComponent = { id: inputId, name: inputName, count: inputCount };
      setComponents(prevComponents => [...prevComponents, newComponent]);

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
        <h2>Component List</h2>
        <ul>
          {components.map(comp => (
            <li key={comp.id}>
              {comp.name} (ID: {comp.id}, Count: {comp.count})
            </li>
          ))}
        </ul>
      </div>

      <div className="right-panel">
        <h2>Add New Component</h2>
        <div className="input-group">
          <label>Component ID</label>
          <input
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="Enter component ID"
          />
        </div>
        <div className="input-group">
          <label>Component Name</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter component name"
          />
        </div>
        <div className="input-group">
          <label>Component Count</label>
          <input
            type="number"
            value={inputCount}
            onChange={(e) => setInputCount(e.target.value)}
            placeholder="Enter component count"
          />
        </div>
        <button onClick={handleAddComponent}>Add Component</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ComponentPage;
