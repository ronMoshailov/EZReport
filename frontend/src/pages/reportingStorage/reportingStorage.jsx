import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {fetchReportComponents, handleRemoveComponentFromReport, fetchAddComponents} from '../../components/APIs/report'
import { fetchAllComponents } from '../../components/APIs/components'
import { getEmployeeId } from '../../components/APIs/employee'

import './reportingStorage.scss'
import ComponentsModal from '../../components/modals/ComponentsModal/ComponentsModal'; // Import the modal component

import { LanguageContext } from '../../utils/globalStates';

const ComponentPage = () => {

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
  const [isComponentsModalOpen, setIsComponentsModalOpen] = useState(false);
  const [componentsToShow, setComponentsToShow] = useState([]);
  const [filterAllComponents, setFilterAllComponents] = useState('');
  const [loading, setLoading] = useState(false);

  // Constant variables
  const inputValue = localStorage.getItem('employee_number');
  const reportId = localStorage.getItem('reportId');

  /* Messages */
  const missing_data_msg = 'נתונים חסרים';
  const incorrect_stock_msg = 'הכמות שהוכנסה לא תקינה';
  const not_exist_msg = 'פריט לא קיים במערכת';
  const over_capacity_msg = 'הכמות הכוללת גדולה ממה שקיים במערכת';
  const empty_report_msg = 'דיווח ריק ולכן לא נשלח';
  const employee_err_msg = 'עובד לא קיים או מספר עובד שגוי';
  const success_msg = `השליחה הצליחה`;

  const { direction, text } = useContext(LanguageContext);

  // Navigate
  const navigate = useNavigate();

  // useEffect
  useEffect(() => {
    handleFetchAllComponents();
    window.addEventListener('keydown', handleEscKey);                   // Add keydown event listener to listen for Escape key press
    if (!inputValue || !reportId )
      navigate('/error')
    return () => window.removeEventListener('keydown', handleEscKey);   // Clean up event listener on component unmount
  }, []);

  // filters
  const filteredComponents = allComponents.filter(comp =>
    comp.name?.toLowerCase().includes(filterAllComponents.toLowerCase()) || 
    comp.serialNumber.toString().includes(filterAllComponents)
  );

  const filteredCollectedComponents = collectedComponents.filter((comp) => {
    return (
      comp.name?.toLowerCase().includes(filterQuery.toLowerCase()) || // Match component name
      comp.serialNumber?.toString().includes(filterQuery) // Match component serial number
    );
  });

  // functions
  const handleFetchAllComponents = async () => {
    let [isTrue, data] = await fetchAllComponents();
    isTrue ? setAllComponents(data) : console.log(data);
  }

  const handleRemoveComponent = (component_num) => {
    setCollectedComponents((prevComponents) => prevComponents.filter((comp) => comp.serialNumber !== component_num));
  };
    
  const handleEscKey = (event) => {
    if (event.key === 'Escape') {       // Check if the pressed key is "Escape"
      handleCloseCheckEmployeeModal();   // Close modal if Escape is pressed
      handleCloseComponentsModal();     // Close the 'show components' modal
    }
  };

  const findComponent = (arr) => {
    return arr.find(comp => comp.serialNumber === Number(inputId));
  };

  const showReportComponents = async () => {
    try {

      const data = await fetchReportComponents(reportId);

      // Get the array of the components
      const componentsList = data.components_list;

      setComponentsToShow(componentsList);          // Set the components to show
      setIsComponentsModalOpen(true);               // Open the 'showReportComponents' modal
    } catch (error) {
      console.error('Error fetching components:', error.message);
    }
  };

  // Display / Hide modals
  const handleCloseCheckEmployeeModal = () => setIsModalOpen(false);

  const handleCloseComponentsModal = () => setIsComponentsModalOpen(false);









  /////////////////////////////////////
    // const location = useLocation();











  




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


  // Submit the report
  const handleSubmitStorageReport = async () => {
    if(loading === true)
      return;
    setLoading(true);
    try {
      
      // Check if the employee exists
      const employee_id = await checkGetEmployeeId();
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
      
      const result = await fetchAddComponents(employee_id, reportId, componentsToAdd, inputComment)
      if(!result[0]){
        alert('הדיווח נכשל');
        await handleFetchAllComponents();
        setLoading(false);
        return;
      }
      console.log(result[1].message);

      // Clear & Reset states
      setInputId('');
      setInputCount('');
      setSuccess(success_msg);
      setCollectedComponents([]);
      setError('');
      setIsModalOpen(false);
      setInputComment('');
  
      // Refresh the components list
      // await handleFetchAllComponents();
      navigate('/dashboard');

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /**
 * Check if the employee exist.
 * @returns If the employee exist return his `_id` || `null` if the employee doesn't exist.
 */
  const checkGetEmployeeId = async () => {
    try {

      const employeeData = await getEmployeeId(inputValue);
      return employeeData.id;
  
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
      console.log(component);
      await handleRemoveComponentFromReport(reportId, component._id, component.stock);
      
      console.log('Component removed successfully.');

      // Fetch the updated components and refresh the modal
      const updatedData = await fetchReportComponents(reportId); // Fetch updated report components

      const updatedComponentsList = updatedData.components_list;

      // Update modal state with the updated components list
      setComponentsToShow(updatedComponentsList);

      // Fetch the updated components and refresh the modal
      await handleFetchAllComponents();

      // Update modal state with the updated components list
      
      // setAllComponents(updatedDatac[1]);                                                                               // Make problems

    } catch (error) {
      console.error('Error removing component from report:', error.message);
    }
  };

  /* Functions that work but I don't know why */

  
  /* Return */    
  return (
    <div className="component-page" style={{direction}}>
    
      {/* Left Panel - Displays the list of selected components */}
      <div className="left-panel">
        <h2 className='move_right border_bottom'>{text.componentList}</h2>
        <ul>

        {/* Filter Input */}
        <input
          id="filter-input"
          type="text"
          placeholder={text.filterComponentByNameOrNumber}
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)} // Update filter query state
          className="search-bar noMaxWidth"
        />

          {/* Render each selected component in a list item */}
          {filteredCollectedComponents.map((comp, index) => (
            <li key={`myComp-${comp.serialNumber}-${index}`} className="component-item">
              <button className="remove-button" onClick={() => handleRemoveComponent(comp.serialNumber)}>✕</button>
              <b>{text.name}:</b> {comp.name} <br />
              <b>{text.componentList}:</b> {comp.serialNumber}<br />
              <b>{text.quantity}:</b> {comp.stock}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel - Adding components and viewing all available components */}
      <div className="right-panel">
        <div className='add_component_container'>
          <h2 className='move_right border_bottom'>{text.componentList}</h2>

          {/* Input for component number */}
          <div className="input-group">
            <label>{text.componentNum}:</label>
            <input
              type="number"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder={text.addComponentNum}
            />
          </div>

          {/* Input for component count */}
          <div className="input-group">
            <label>{text.quantity}:</label>
            <input
              type="number"
              value={inputCount}
              onChange={(e) => setInputCount(Number(e.target.value))}
              placeholder={text.addQuantity}
            />
          </div>

          {/* Textarea for comments */}
          <div className="input-group">
            <label>{text.comments}:</label>
            <textarea
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
              placeholder={`${text.comments}...`}
              rows="2"   // Limits the textarea to 2 rows
              className="comment-textarea"  // Apply a custom class for additional styling
            />
          </div>

          {/* Buttons for adding component and submitting report */}
          <div className='buttons-container'>
            <button className='btn cancel-btn' onClick={() => navigate('/dashboard')}>{text.return}</button>
            <button className='showComponents-btn btn' onClick={() => showReportComponents()}>{text.showReportComponents}</button>
            <button className='btn send-btn' onClick={handleSendReport}>{text.sendReporting}</button>
            <button className='addComponent-btn btn' onClick={handleAddComponent}>{text.addComponent}</button>
          </div>
          {/* Display error and success messages if present */}
          {error && <p className="errorMessage">{error}</p>}
          {success && <p className="successMessage">{success}</p>}
        </div>

        {/* Section displaying all available components */}
        <div className="all_components">
          <h2 className='move_right border_bottom'>{text.addComponentsInDB}</h2>
          {/* Search bar for filtering all components */}
          <input 
            type="text" // Changed to text for better flexibility
            placeholder={`${text.filterByComponentNum}...`} 
            value={filterAllComponents} // Use the filter state here
            onChange={(e) => setFilterAllComponents(e.target.value)} // Update state on input change
            className="search-bar noMaxWidth"
          />
          <ul>
            {/* Render each available component in a list item */}
            {filteredComponents.map((comp, index) => (
              <li key={`allComp-${comp.serialNumber}-${index}`}>
                <b>{text.name}:</b> {comp.name} <br />
                <b>{text.componentNum}:</b> {comp.serialNumber}<br />
                <b>{text.quantity}:</b> {comp.stock}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal for employee ID input, shown when `isModalOpen` is true */}
      {isModalOpen &&
        <div className="modal-container-send-reporting">
          <div className="modal-components">

            <button className="close-btn" onClick={handleCloseCheckEmployeeModal}>✕</button>
            <h2>{text.areYouSure}</h2>
            <div className='button-container'>
              <button className="cancel-btn btn" onClick={handleCloseCheckEmployeeModal}>{text.cancel}</button>
              <button className="submit-btn btn" onClick={handleSubmitStorageReport}>{text.send}</button>
            </div>

          </div>
        </div>
      }

        {/* Modal */}
        <ComponentsModal
          isOpen={isComponentsModalOpen}
          onClose={handleCloseComponentsModal}
          components={componentsToShow}
          onRemove={handleRemoveFromReport}
        />
    </div>
  );
};

export default ComponentPage;
