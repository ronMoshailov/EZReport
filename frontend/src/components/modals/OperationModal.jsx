import React, { useState, useEffect } from 'react';
import './OperationModal.scss';  // Assuming you have styles for the modal
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import { isEmployeeExist } from '../APIs/API_employee';
import { handleEscKey } from '../functions';

const OperationModal = ({ onClose, report_id, report_serialNum, report_completed, report_ordered, workspace, setIsOperationModal }) => {

    /* States */
    const [selectedOption, setSelectedOption] = useState('');                                           // Holds the selected option
    const [employee, setEmployee] = useState('');                                                       // Holds the employee number
    const [loading, setLoading] = useState(false);                                                      // Determine if loading
    const [errorMessage, setErrorMessage] = useState('');                                               // Holds the error message
    const navigate = useNavigate();                                                                     // Router navigation setup

    useEffect(() => {
        window.addEventListener('keydown', addEscListener);                   // Add keydown event listener to listen for Escape key press
    },[]);

    // Handle the changes in the chosen operation from the client
    const handleOptionChange = (option) => {
        setSelectedOption(option);  
    };

    const handleCloseModal = () => {
        setIsOperationModal(false);
    }

    // Add Esc press key listener
    const addEscListener = (event) => handleEscKey(event, handleCloseModal);

    // Handle the changes in the input bar
    const handleInputChange = (e) => {
        setEmployee(e.target.value);
    };

    // Handle submit
    const handleSubmit = async () => {
        setLoading(true);                                                                   // Set loading
        setErrorMessage('');                                                                // Clear the error message
        
        try{
            const data = await isEmployeeExist(employee);                                   // Call API to check if employee exist
            console.log(data);
            if (data.exist) {                                                               // If exist
                setLoading(false);                                                          // Stop the loading
                localStorage.setItem('employee_number', data.employee.number_employee);     // Save the employee number in localStorage 
            } else{                                                                         // If not exist
                setLoading(false);                                                          // Stop the loading
                setErrorMessage('מספר עובד לא קיים');                                      // Set error message
                return;                                                                     // Stop the function
            }
        } catch (err) {
            console.log('There was an error:', err);
            setErrorMessage('שגיאה בשרת');
            setLoading(false);
            return;
        }

        localStorage.setItem('report_id', report_id);                                       // Save the report id in localStorage 
        if (selectedOption === 'new-report' && workspace === 'Production') {                // If thr production wants to make new reporting
            localStorage.setItem('report_serialNum', report_serialNum);                     // Save the report serial number in localStorage
            localStorage.setItem('report_completed', report_completed);                     // Save the completed quantity in localStorage
            localStorage.setItem('report_ordered', report_ordered);                         // Save the ordered quantity in localStorage
            navigate('/ReportingProduction');                                                   // Go to the production page
        } else if(selectedOption === 'new-report' && workspace === 'Storage'){              // If thr Storage wants to make new reporting
            navigate('/ReportingStorage', { state: { report_id: report_id } });             // Go to the storage page
        }
        else {
            setErrorMessage('סוג הפעולה לא נבחרה.');
        };
    }

    return (
        <div className="modal-container-operation">
            <div className="modal">
                <button className="close-btn" onClick={handleCloseModal}>✕</button>

                <h2>מספר עובד:</h2>
                
                <div className="form-group">
                    <label>:מספר עובד</label>
                    <input type="number" onChange={handleInputChange} required/>
                </div>

                <div className="form-options">
                    {/* Checkboxes */}
                    <div>
                        <input 
                            type="checkbox" 
                            id="new-report" 
                            checked={selectedOption === 'new-report'}  
                            onChange={() => handleOptionChange('new-report')}  
                        />
                        <label htmlFor="new-report"> דיווח חדש</label>
                    </div>
                </div>

                <button className="submit-btn" onClick={handleSubmit}>המשך</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {loading && <p className="success-message">טוען</p>}
            </div>
        </div>
    );
};

export default OperationModal;
