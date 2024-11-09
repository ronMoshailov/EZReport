import React, { useState } from 'react';
import './OperationModal.scss';  // Assuming you have styles for the modal
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

const Modal = ({ onClose, report_id, workspace }) => {

    /* States */
    const [selectedOption, setSelectedOption] = useState('');
    const [employee, setEmployee] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleOptionChange = (option) => {
        setSelectedOption(option);  // Only set one option at a time
    };

    const handleInputChange = (e) => {
        setEmployee(e.target.value);
    };

    const handleSubmit = async () => {
            // Set loading and errors
            setLoading(true);
            setErrorMessage('');        
        try{
            console.log('Employee number: ' + employee);
            const response = await fetch('http://localhost:5000/api/isEmployeeExist', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: employee })
              });
              if (response.status === 404) {
                setErrorMessage('מספר עובד לא קיים במערכת.');
                setLoading(false);
                return;
              }    
              if (!response.ok) throw new Error('Failed to fetch reports');
              const data = await response.json();
              if (data.exist) {
                console.log('The employee exists. Name:', data.employee[0].fullName);
                setLoading(false);
            }
        } catch (err) {
            console.log('There was an error:', err);
            setErrorMessage('שגיאה בשרת');        
        }

        if (selectedOption === 'new-report' && workspace === 'Production') {

            navigate('/new-report-page');
        } else if(selectedOption === 'new-report' && workspace === 'Storage'){
            navigate('/newStorageReport', { state: { report_id: report_id } });
        }
        else {
            setErrorMessage('סוג הפעולה לא נבחרה.');
        };
    }

    
    
    return (
        <div className="modal-container">
            <div className="modal">
                <button className="close-btn" onClick={onClose}>✕</button>

                <h2>מספר עובד:</h2>
                
                <div className="form-group">
                    <label>:מספר עובד</label>
                    <input type="number" onChange={handleInputChange} required/>
                </div>

                <div className="form-options">
                    {/* Step 3: Create checkboxes that call handleOptionChange on click */}
                    <div>
                        <input 
                            type="checkbox" 
                            id="new-report" 
                            checked={selectedOption === 'new-report'}  // Only check if it's the selected one
                            onChange={() => handleOptionChange('new-report')}  // Update state
                        />
                        <label htmlFor="new-report"> דיווח חדש</label>
                    </div>
                    {/* <div>
                        <input 
                            type="checkbox" 
                            id="continue-report" 
                            checked={selectedOption === 'continue-report'}  // Only check if it's the selected one
                            onChange={() => handleOptionChange('continue-report')}  // Update state
                        />
                        <label htmlFor="continue-report"> המשך דיווח קיים</label>
                    </div>
                    <div>
                        <input 
                            type="checkbox" 
                            id="create-precision" 
                            checked={selectedOption === 'create-precision'}  // Only check if it's the selected one
                            onChange={() => handleOptionChange('create-precision')}  // Update state
                        />
                        <label htmlFor="create-precision"> צפייה בדיווים</label>
                    </div> */}
                </div>

                <button className="submit-btn" onClick={handleSubmit}>המשך</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {loading && <p className="success-message"></p>}
            </div>
        </div>
    );
};

export default Modal;
