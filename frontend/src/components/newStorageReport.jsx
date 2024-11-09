import React, { useState, useEffect } from 'react';
import './newStorageReport.scss'
import { useLocation } from 'react-router-dom';

const ComponentPage = () => {
  const location = useLocation();
  const report_id = location.state?.report_id;

  
  /* States */
  const [allComponents, setAllComponents] = useState([]);
  const [myComponents, setMyComponents] = useState([]);
  const [inputId, setInputId] = useState('');
  const [inputCount, setInputCount] = useState('');
  const [inputComment, setInputComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterAllComponents, setFilterAllComponents] = useState(''); // Search term for filtering components
  const [filterMyComponents, setFilterMyComponents] = useState(''); // Search term for filtering components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(''); // State to store input value
  const [isComponentsModalOpen, setIsComponentsModalOpen] = useState(false);
  const [componentsToShow, setComponentsToShow] = useState([]);
  

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
    // Call the fetchComponents function immediately upon component mount
    fetchComponents();
  }, []);  // Empty dependency array means this effect runs only once when the component mounts
  

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

  /* Functions */
  // Close modal function
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to close the modal
  const handleCloseComponentsModal = () => setIsComponentsModalOpen(false);

  // Filter allComponents based on the search term
  const filteredComponents = allComponents.filter(comp =>
    comp.name.toLowerCase().includes(filterAllComponents.toLowerCase()) || comp.serialNumber.toString().includes(filterAllComponents)
  );

  // Filter allComponents based on the search term
  const filteredMyComponents = myComponents.filter(comp =>
    comp.name.toLowerCase().includes(filterMyComponents.toLowerCase()) || comp.serialNumber.toString().includes(filterMyComponents)
  );

  /** 
   * Remove the component from the array of the components in the current report.
   * 
   * @param component_num Component number. 
   */
  const handleRemoveComponent = (component_num) => {
    setMyComponents((prevComponents) => prevComponents.filter((comp) => comp.serialNumber !== component_num));
  };

  /** 
   * Find component by component number in the array named `arr`.
   * 
   * @param arr Array of components.
   * @returns The component that was found || `undefined` if wasn't found.
   */
  const findComponent = (arr) => {
    return arr.find(comp => comp.serialNumber === Number(inputId));
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
      if (dbComponent.stock < inputCount) {
        alert(over_capacity_msg);
        return;
      }
      // Component already in myComponents list
      if (myComponent) { 
        if (dbComponent.stock < myComponent.stock + Number(inputCount)) {
          alert(over_capacity_msg);
          return;
        } else {
          // Update count if component exists in myComponents
          setMyComponents((prevComponents) => 
            prevComponents.map((comp) => 
              comp.serialNumber === myComponent.serialNumber
                ? { ...comp, component_count: comp.stock + Number(inputCount) }
                : comp
            )
          );
        }
      } else {
        // Add new component if it doesn't exist in myComponents
        setMyComponents((prevComponents) => [...prevComponents, {
          serialNumber: dbComponent.serialNumber,
          name: dbComponent.name,
          stock: Number(inputCount),
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

  const showReportComponents = async (report_id) => {
    try {
      // Fetch components list for the report
      const response = await fetch(`http://localhost:5000/api/getReportComponents/${report_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch components. Status: ${response.status}`);
      }
  
      const data = await response.json();
      const componentsList = data.components_list;
  
      // Fetch details for each component using their ID
      const detailedComponents = await Promise.all(
        componentsList.map(async (component) => {
          const res = await fetch(`http://localhost:5000/api/getComponentByID/${component.component}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
  
          if (!res.ok) throw new Error(`Failed to fetch component details. Status: ${res.status}`);
  
          const detailedComponent = await res.json();
          return {
            name: detailedComponent.name,
            serialNumber: detailedComponent.serialNumber,
            stock: component.stock, // Include stock from the report
          };
        })
      );
  
      // Update state with the detailed components and open the modal
      setComponentsToShow(detailedComponents);
      setIsComponentsModalOpen(true);
    } catch (error) {
      console.error('Error fetching components:', error.message);
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
        stock: comp.stock,  // Quantity of the component
      }));
  
      // Send a POST request to the server to add a new report
      let response = await fetch('http://localhost:5000/api/addReportStorage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employee_id, components_list: componentsWithCount, comment:inputComment }) // Payload with employee ID and components
      });

      // Handle an unsuccessful response
      if (!response.ok) throw new Error('Failed to add reportStorage');

      // Send a POST request to the server to add a new report
      response = await fetch('http://localhost:5000/api/addComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report_id, comment:inputComment }) // Payload with employee ID and components
      });

      // Handle an unsuccessful response
      if (!response.ok) throw new Error('Failed to add comment');

      response = await fetch('http://localhost:5000/api/decreaseStock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ components_list: componentsWithCount }) // Payload with employee ID and components
      });

      // Handle an unsuccessful response
      if (!response.ok) throw new Error('Failed to add comment');

      // Send a POST request to the server to add a new report
      response = await fetch('http://localhost:5000/api/addComponents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report_id, components_list: componentsWithCount }) // Payload with employee ID and components
      });

      // Handle an unsuccessful response
      if (!response.ok) throw new Error('Failed to add comment');

            
      fetchComponents();

      // Clear input fields and reset states after successful submission
      setInputId(empty_str);             // Clear component ID input
      setSuccess(success_msg);           // Display success message
      setMyComponents([]);               // Clear selected components list
      setInputCount(empty_str);          // Clear component count input
      setError(empty_str);               // Clear any error message
      setIsModalOpen(false);             // Close the modal after successful submission
      setInputComment('');               // Clear the comment input
      
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
            <li key={`myComp-${comp.serialNumber}-${index}`} className="component-item">
              <button className="remove-button" onClick={() => handleRemoveComponent(comp.serialNumber)}>✕</button>
              <b>שם:</b> {comp.name} <br />
              <b>מספר רכיב:</b> {comp.serialNumber}<br />
              <b>כמות:</b> {comp.stock}
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
            <label>מספר רכיב:</label>
            <input
              type="number"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="הכנס מספר רכיב..."
            />
          </div>

          {/* Input for component count */}
          <div className="input-group">
            <label>כמות:</label>
            <input
              type="number"
              value={inputCount}
              onChange={(e) => setInputCount(Number(e.target.value))}
              placeholder="הכנס כמות"
            />
          </div>

          {/* Textarea for comments */}
          <div className="input-group">
            <label>הערות:</label>
            <textarea
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
              placeholder="הערות..."
              rows="2"   // Limits the textarea to 2 rows
              className="comment-textarea"  // Apply a custom class for additional styling
            />
          </div>

          {/* Buttons for adding component and submitting report */}
          <div id='storange_buttons_container'>
            <button className='storage_button' onClick={handleAddComponent}>הוסף רכיב</button>
            <button className='storage_button' onClick={handleSendReport}>שלח דיווח</button>
            <button className='storage_button' onClick={() => showReportComponents(report_id)}>הצג רכיבים בהזמנה</button>
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
              <li key={`allComp-${comp.serialNumber}-${index}`}>
                <b>שם:</b> {comp.name} <br />
                <b>מספר רכיב:</b> {comp.serialNumber}<br />
                <b>כמות:</b> {comp.stock}
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

        {/* Modal */}
        {isComponentsModalOpen && (
        <div className="modal-container-components">
          <div className="modal-components">
            <button className="close-btn" onClick={handleCloseComponentsModal}>✕</button>
            <h2>רשימת רכיבים</h2>
            <ul>
              {componentsToShow.map((component, index) => (
                <li key={`component-${component.serialNumber}-${index}`}>
                  <b>שם:</b> {component.name} <br />
                  <b>מספר רכיב:</b> {component.serialNumber} <br />
                  <b>כמות:</b> {component.stock} <br />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};

export default ComponentPage;
