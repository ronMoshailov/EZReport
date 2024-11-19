import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './newStorageReport.scss'
import {fetchReportComponents, handleRemoveComponentFromReport, fetchAndComponents} from '../APIs/API_report'
import { fetchAllComponents } from '../APIs/API_components'
import { isEmployeeExist } from '../APIs/API_employee'
import ComponentsModal from '../modals/ComponentsModal'; // Import the modal component

const ComponentPage = () => {
  const location = useLocation();
  const report_id = location.state?.report_id;

  /* States */
  const [allComponents, setAllComponents] = useState([]);
  const [collectedComponents, setCollectedComponents] = useState([]);
  const [filterQuery, setFilterQuery] = useState(""); // State for the filter input
  const [inputId, setInputId] = useState('');
  const [inputCount, setInputCount] = useState('');
  const [inputComment, setInputComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isComponentsModalOpen, setIsComponentsModalOpen] = useState(false);
  const [componentsToShow, setComponentsToShow] = useState([]);
  const [filterAllComponents, setFilterAllComponents] = useState('');

  /* Messages */
  const missing_data_msg = 'נתונים חסרים';
  const incorrect_stock_msg = 'הכמות שהוכנסה לא תקינה';
  const not_exist_msg = 'פריט לא קיים במערכת';
  const over_capacity_msg = 'הכמות הכוללת גדולה ממה שקיים במערכת';
  const empty_report_msg = 'דיווח ריק ולכן לא נשלח';
  const employee_err_msg = 'עובד לא קיים או מספר עובד שגוי';
  const success_msg = `השליחה הצליחה`;

  // useEffect
  useEffect(() => {
    handleFetchAllComponents();
    window.addEventListener('keydown', handleEscKey);                   // Add keydown event listener to listen for Escape key press
    return () => window.removeEventListener('keydown', handleEscKey);   // Clean up event listener on component unmount
  }, []);

  // Fetch all components
  const handleFetchAllComponents = async () => {

    let [isTrue, data] = await fetchAllComponents();
    if(isTrue){
      setAllComponents(data);                                                 // Update the state with the fetched components data
    } else{
      console.log(data);
    }
  }

  const filteredComponents = allComponents.filter(comp =>
    comp.name?.toLowerCase().includes(filterAllComponents.toLowerCase()) || 
    comp.serialNumber.toString().includes(filterAllComponents)
  );

  // Filter the collected components based on the filterQuery
  const filteredCollectedComponents = collectedComponents.filter((comp) => {
    return (
      comp.name?.toLowerCase().includes(filterQuery.toLowerCase()) || // Match component name
      comp.serialNumber?.toString().includes(filterQuery) // Match component serial number
    );
  });
  
   /** 
   * Remove the component from the array of the components in the current report.
   * 
   * @param component_num Component number. 
   */
    const handleRemoveComponent = (component_num) => {
      setCollectedComponents((prevComponents) => prevComponents.filter((comp) => comp.serialNumber !== component_num));
    };
    
  /**
   * Add ESC listener 
   * 
   * @param event event  
   */
  const handleEscKey = (event) => {
    if (event.key === 'Escape') {       // Check if the pressed key is "Escape"
      handleCloseCheckEmployeeModal();   // Close modal if Escape is pressed
      handleCloseComponentsModal();     // Close the 'show components' modal
    }
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

  // Close modal check emplyee
  const handleCloseCheckEmployeeModal = () => setIsModalOpen(false);

  // Function to close the modal
  const handleCloseComponentsModal = () => setIsComponentsModalOpen(false);

    // Handle add component button click
  const handleAddComponent = async () => {
    try {

      // Check if there are missing data
      if (inputId === '' || inputCount === '') {
        setError(missing_data_msg);
        setSuccess('');
        return;
      }

      // Check if the inputCount are invalid value
      else if(inputCount <= 0){
        setError(incorrect_stock_msg);
        setSuccess('');
        return;
      }
      
      // Check if the component exists in the database
      const dbComponent = findComponent(allComponents);
      if (dbComponent === undefined) {
        alert(not_exist_msg);
        return;
      }
      
      // Check if there's enough in stock
      const myComponent = findComponent(collectedComponents);
      if (dbComponent.stock < inputCount) {
        alert(over_capacity_msg);
        return;
      }
      
      // Component already in collectedComponents list
      if (myComponent) { 
        // Check if the amount of components can be added
        if (dbComponent.stock < myComponent.stock + Number(inputCount)) {
          alert(over_capacity_msg);
          return;
        } else {
          // Update count if component exists in collectedComponents
          setCollectedComponents((prevComponents) => 
            prevComponents.map((comp) => 
              comp.serialNumber === myComponent.serialNumber
                ? { ...comp, stock: comp.stock + Number(inputCount) }
                : comp
            )
          );
        }
      } else {
        // Add new component if it doesn't exist in collectedComponents
        setCollectedComponents((prevComponents) => [...prevComponents, {
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

  // Show the components in the report
  const showReportComponents = async (report_id) => {
    try {

      const data = await fetchReportComponents(report_id);

      // Get the array of the components
      const componentsList = data.components_list;

      setComponentsToShow(componentsList);          // Set the components to show
      setIsComponentsModalOpen(true);               // Open the 'showReportComponents' modal
    } catch (error) {
      console.error('Error fetching components:', error.message);
    }
  };

  // Submit the report
  const handleSubmitStorageReport = async () => {

    try {
      
      // Check if the employee exists
      const employee_id = await checkIsEmployeeExist();
      
      if (!employee_id) {
        setError(employee_err_msg);
        setIsModalOpen(false);
        return;
      }
  
      // Prepare the components list
      const componentsToAdd = collectedComponents.map((comp) => ({
        component: comp._id,          // Component ID
        stock: comp.stock,            // Quantity of the component
      }));
      
      
      const result = await fetchAndComponents(employee_id, report_id, componentsToAdd, inputComment)
      console.log(result.message);

      // Clear & Reset states
      setInputId('');
      setInputCount('');
      setSuccess(success_msg);
      setCollectedComponents([]);
      setError('');
      setIsModalOpen(false);
      setInputComment('');
  
      // Refresh the components list
      await handleFetchAllComponents();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
 * Check if the employee exist.
 * @returns If the employee exist return his `_id` || `null` if the employee doesn't exist.
 */
  const checkIsEmployeeExist = async () => {
    try {
      // Parse the JSON response to get employee data
      const employeeData = await isEmployeeExist(inputValue)

      // Return the _id of the found employee
      return employeeData.employee._id;
  
    } catch (err) {
      // Log the error message if an exception occurs
      console.log(err.message);
      return null;  // Return null if an error occurred
    }
  };

  // Handle the send of the storage report
  const handleSendReport = () => {
    if (collectedComponents.length === 0) {
      setError(empty_report_msg);
      setSuccess('');
      return;
    }
    setIsModalOpen(true); // Open the modal for employee input
  };

  const handleRemoveFromReport = async (component) => {
    try {
      // Call the function to remove the component from the report
      await handleRemoveComponentFromReport(report_id, component._id, component.stock);
      
      console.log('Component removed successfully.');

      // Fetch the updated components and refresh the modal
      const updatedData = await fetchReportComponents(report_id); // Fetch updated report components
      // console.log("Fetched report components");
      // console.log(updatedData);
      
      const updatedComponentsList = updatedData.components_list;
      // console.log("component list: ");
      // console.log(updatedComponentsList);

      // Update modal state with the updated components list
      setComponentsToShow(updatedComponentsList);
      // console.log('Updated components to show like the component list');
      // console.log(updatedComponentsList);

      // Fetch the updated components and refresh the modal
      await handleFetchAllComponents();
      // console.log('Fetched all components');
      // console.log(updatedDatac[1]);

      // Update modal state with the updated components list
      
      // setAllComponents(updatedDatac[1]);                                                                               // Make problems
      // console.log('Updated all components');
      // console.log(allComponents);

    } catch (error) {
      console.error('Error removing component from report:', error.message);
    }
  };

  /* Functions that work but I don't know why */

  
  /* Return */    
  return (
    <div className="component-page">
    
      {/* Left Panel - Displays the list of selected components */}
      <div className="left-panel">
        <h2 className='move_right border_bottom'>רשימת הרכיבים</h2>
        <ul>

        {/* Filter Input */}
        <input
          id="filter-input"
          type="text"
          placeholder="חפש רכיב לפי שם או מספר..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)} // Update filter query state
          className="search-bar"
        />

          {/* Render each selected component in a list item */}
          {filteredCollectedComponents.map((comp, index) => (
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
            type="text" // Changed to text for better flexibility
            placeholder="חפש לפי מספר רכיב..." 
            value={filterAllComponents} // Use the filter state here
            onChange={(e) => setFilterAllComponents(e.target.value)} // Update state on input change
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
            {/* Close modal button */}
            <button className="close-btn" onClick={handleCloseCheckEmployeeModal}>✕</button>
            <h2>{'הקלד מספר עובד'}</h2>

            {/* Input field for entering employee ID */}
            <div className="form-group">
              <label>מספר עובד:</label>
              <input id="sendModalInput" type="Number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            </div>

            {/* Submit button for modal */}
            <button className="submit-btn" onClick={handleSubmitStorageReport}>המשך</button>
          </div>
        </div>
      }

        {/* Modal */}
        <ComponentsModal
          isOpen={isComponentsModalOpen}
          onClose={handleCloseComponentsModal}
          title="רשימת רכיבים"
          placeholder="חפש לפי מספר רכיב"
          components={componentsToShow}
          onFilterChange={(query) => {
            // Handle filtering logic here, if needed
          }}
          onRemove={handleRemoveFromReport}
        />
    </div>
  );
};

export default ComponentPage;
