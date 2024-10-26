import React, { useState } from 'react';
import './modal.scss';  // Assuming you have styles for the modal
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

const Modal = ({ onClose, selectedReport }) => {
    // Step 1: Create state to manage which option is selected
    const [selectedOption, setSelectedOption] = useState('');
    const navigate = useNavigate();  // Step 1: Initialize useNavigate

    // Step 2: Handle changing the selected option
    const handleOptionChange = (option) => {
        setSelectedOption(option);  // Only set one option at a time
    };

        // Step 3: Handle button click
        const handleSubmit = () => {
            if (selectedOption === 'new-report') {
                // Step 4: Navigate to the new report page if the first option is selected
                navigate('/new-report');
            } else {
                // Handle other options here or show an error
                console.log('Another option selected or no option selected');
            }
        };
    
    return (
        <div className="modal-container">
            <div className="modal">
                <button className="close-btn" onClick={onClose}>✕</button>

                <h2>מספר עובד: {selectedReport ? selectedReport.employeeNumber : ''}</h2>
                
                <div className="form-group">
                    <label>:מספר עובד</label>
                    <input type="text" value={selectedReport.employeeNumber} />
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
                    <div>
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
                        <label htmlFor="create-precision"> צפייה בדיוקים</label>
                    </div>
                </div>

                <button className="submit-btn" onClick={handleSubmit}>המשך</button>
            </div>
        </div>
    );
};

export default Modal;
