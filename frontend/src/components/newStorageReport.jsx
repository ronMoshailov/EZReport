import React, { useState, useEffect } from 'react';
import './newStorageReport.scss'
const mongoose = require('mongoose');

const ComponentPage = () => {

  
  /* States */
  const [allComponents, setAllComponents] = useState([]);
  const [myComponents, setMyComponents] = useState([]);
  const [inputId, setInputId] = useState('');
  const [inputCount, setInputCount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterAllComponents, setFilterAllComponents] = useState(''); // Search term for filtering components
  const [filterMyComponents, setFilterMyComponents] = useState(''); // Search term for filtering components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(''); // State to store input value


  /* Messages */
  const empty_str = '';
  const missing_data_msg = 'נתונים חסרים';
  const incorrect_stock_msg = 'הכמות שהוכנסה לא תקינה';
  const not_exist_msg = 'פריט לא קיים במערכת';
  const over_capacity_msg = 'הכמות הכוללת גדולה ממה שקיים במערכת';
  const empty_report_msg = 'דיווח ריק ולכן לא נשלח';
  const employee_err_msg = 'עובד לא קיים או מספר עובד שגוי';
  const success_msg = `השליחה הצליחה`;


  /* useEffect */
  useEffect(() => {
    // Fetch all components from MongoDB on initial render
    const fetchComponents = async () => {
      try {
        // Send a GET request to fetch components data from the server
        const response = await fetch('http://localhost:5000/api/components');
        
        // Parse the JSON response
        const data = await response.json();
        
        // Update the state with the fetched components data
        setAllComponents(data);
      } catch (err) {
        // Log any error that occurs during the fetch process
        console.error('Failed to fetch components', err);
      }
    };
  
    // Call the fetchComponents function immediately upon component mount
    fetchComponents();
  }, []);  // Empty dependency array means this effect runs only once when the component mounts
  

  /* Functions */
  // Close modal function
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Filter allComponents based on the search term
  const filteredComponents = allComponents.filter(comp =>
    comp.component_name.toLowerCase().includes(filterAllComponents.toLowerCase()) || comp.component_num.toString().includes(filterAllComponents)
  );

  // Filter allComponents based on the search term
  const filteredMyComponents = myComponents.filter(comp =>
    comp.component_name.toLowerCase().includes(filterMyComponents.toLowerCase()) || comp.component_num.toString().includes(filterMyComponents)
  );

  /** 
   * Remove the component from the array of the components in the current report.
   * 
   * @param component_num Component number. 
   */
  const handleRemoveComponent = (component_num) => {
    setMyComponents((prevComponents) => prevComponents.filter((comp) => comp.component_num !== component_num));
  };

  /** 
   * Find component by component number in the array named `arr`.
   * 
   * @param arr Array of components.
   * @returns The component that was found || `undefined` if wasn't found.
   */
  const findComponent = (arr) => {
    return arr.find(comp => comp.component_num === Number(inputId));
  };

  // Handle add component button click
  const handleAddComponent = async () => {
    try {
      // Check if there are missing data
      if (inputId === empty_str || inputCount === empty_str) {
        setError(missing_data_msg);
        setSuccess(empty_str);
        return;
      }
      else if(inputCount <= 0){
        setError(incorrect_stock_msg);
        setSuccess(empty_str);
        return;
      }
      // Check if the component exists in the database
      const dbComponent = findComponent(allComponents);
      if (dbComponent === undefined) {
        alert(not_exist_msg);
        return;
      }
  
      // Check if there's enough in stock
      const myComponent = findComponent(myComponents);
      if (dbComponent.component_count < inputCount) {
        alert(over_capacity_msg);
        return;
      }
      // Component already in myComponents list
      if (myComponent) { 
        if (dbComponent.component_count < myComponent.component_count + Number(inputCount)) {
          alert(over_capacity_msg);
          return;
        } else {
          // Update count if component exists in myComponents
          setMyComponents((prevComponents) => 
            prevComponents.map((comp) => 
              comp.component_num === myComponent.component_num
                ? { ...comp, component_count: comp.component_count + Number(inputCount) }
                : comp
            )
          );
        }
      } else {
        // Add new component if it doesn't exist in myComponents
        setMyComponents((prevComponents) => [...prevComponents, {
          component_num: dbComponent.component_num,
          component_name: dbComponent.component_name,
          component_count: Number(inputCount),
          _id: dbComponent._id
        }]);
      }
  
      // Clear input fields
      setInputId(''); 
      setInputCount('');
      setError('');
      setSuccess('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Submit the report
  const handleSubmitModal = async () => {
    try {
      // Check if the employee exists and retrieve their ID
      const employee_id = await isEmployeeExist();
      
      // If no employee ID is returned, set an error message and close the modal
      if (!employee_id) {
        setError(employee_err_msg);
        setIsModalOpen(false);
        return;
      }
  
      // Prepare the components list by mapping each component's ID and count
      const componentsWithCount = myComponents.map(comp => ({
        component: comp._id,          // Component ID
        component_count: comp.component_count,  // Quantity of the component
      }));
  
      // Send a POST request to the server to add a new report
      const response = await fetch('http://localhost:5000/api/addReportStorage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employee_id, components_list: componentsWithCount }) // Payload with employee ID and components
      });
  
      // Handle an unsuccessful response
      if (!response.ok) throw new Error('Failed to add reportStorage');
  
      // Clear input fields and reset states after successful submission
      setInputId(empty_str);             // Clear component ID input
      setSuccess(success_msg);           // Display success message
      setMyComponents([]);               // Clear selected components list
      setInputCount(empty_str);          // Clear component count input
      setError(empty_str);               // Clear any error message
      setIsModalOpen(false);             // Close the modal after successful submission
  
    } catch (err) {
      // Set the error message if there's a failure
      setError(err.message);
    }
  };

  /**
   * Check if the employee exist.
   * @returns If the employee exist return his `_id` || `null` if the employee doesn't exist.
   */
  const isEmployeeExist = async () => {
    try {
      // Send a POST request to check if the employee exists
      const response = await fetch('http://localhost:5000/api/isEmployeeExist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
        body: JSON.stringify({ data: inputValue })  // Pass the input value in the request body
      });
  
      // Check if the response is successful
      if (!response.ok) throw new Error(`Failed to fetch employee data. Status: ${response.status}`);
  
      // Parse the JSON response to get employee data
      const employeeData = await response.json();
  
      // Validate the employee data: check if it is an array with exactly one employee
      if (!Array.isArray(employeeData.employee) || employeeData.employee.length !== 1) {
        return null;  // Return null if no employee found or if data format is unexpected
      }
  
      // Return the _id of the found employee
      return employeeData.employee[0]._id;
  
    } catch (err) {
      // Log the error message if an exception occurs
      console.log(err.message);
      return null;  // Return null if an error occurred
    }
  };
  
  // Handle the send of the storage report
  const handleSendReport = () => {
    if (myComponents.length === 0) {
      setError(empty_report_msg);
      setSuccess(empty_str);
      return;
    }
    setIsModalOpen(true); // Open the modal for employee input
  };

  /* Return */    
  return (
    <div className="component-page">
      
      {/* Left Panel - Displays the list of selected components */}
      <div className="left-panel">
        <h2 className='move_right border_bottom'>רשימת הרכיבים</h2>
        <ul>
          {/* Search bar for filtering selected components */}
          <input 
              type="Number"
              placeholder="חפש לפי מספר רכיב..." 
              value={filterMyComponents} 
              onChange={(e) => setFilterMyComponents(e.target.value)}
              className="search-bar"
            />

          {/* Render each selected component in a list item */}
          {filteredMyComponents.map((comp, index) => (
            <li key={`myComp-${comp.component_num}-${index}`} className="component-item">
              <button className="remove-button" onClick={() => handleRemoveComponent(comp.component_num)}>✕</button>
              <b>שם:</b> {comp.component_name} <br />
              <b>מספר רכיב:</b> {comp.component_num}<br />
              <b>כמות:</b> {comp.component_count}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel - Adding components and viewing all available components */}
      <div className="right-panel">
        <div className='add_component_container'>
          <h2 className='move_right border_bottom'>הוספת רכיב</h2>

          {/* Input for component number */}
          <div className="input-group">
            <label>:מספר רכיב</label>
            <input
              type="number"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="הכנס מספר רכיב..."
            />
          </div>

          {/* Input for component count */}
          <div className="input-group">
            <label>:כמות</label>
            <input
              type="number"
              value={inputCount}
              onChange={(e) => setInputCount(Number(e.target.value))}
              placeholder="הכנס כמות"
            />
          </div>

          {/* Buttons for adding component and submitting report */}
          <div id='storange_buttons_container'>
            <button className='storage_button' onClick={handleAddComponent}>הוסף רכיב</button>
            <button className='storage_button' onClick={handleSendReport}>שלח דיווח</button>
          </div>
          {/* Display error and success messages if present */}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>

        {/* Section displaying all available components */}
        <div className="all_components">
          <h2 className='move_right border_bottom'>כל הרכיבים במערכת</h2>
          {/* Search bar for filtering all components */}
          <input 
              type="Number"
              placeholder="חפש לפי מספר רכיב..." 
              value={filterAllComponents} 
              onChange={(e) => setFilterAllComponents(e.target.value)}
              className="search-bar"
            />
          <ul>
            {/* Render each available component in a list item */}
            {filteredComponents.map((comp, index) => (
              <li key={`allComp-${comp.component_num}-${index}`}>
                <b>שם:</b> {comp.component_name} <br />
                <b>מספר רכיב:</b> {comp.component_num}<br />
                <b>כמות:</b> {comp.component_count}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal for employee ID input, shown when `isModalOpen` is true */}
      {isModalOpen &&
        <div className="modal-container">
          <div className="modal">
            <button className="close-btn" onClick={handleCloseModal}>✕</button>
            <h2>{'הקלד מספר עובד'}</h2>

            {/* Input field for entering employee ID */}
            <div className="form-group">
              <label>מספר עובד:</label>
              <input
                id="sendModalInput"
                type="Number"
                value={inputValue} // Bind input value to state
                onChange={(e) => setInputValue(e.target.value)} // Update state on input change
              />
            </div>

            {/* Submit button for modal */}
            <button className="submit-btn" onClick={handleSubmitModal}>המשך</button>
          </div>
        </div>
      }
    </div>
  );
};

export default ComponentPage;
