import React from 'react';
import './sendModal.scss';  // Assuming you have styles for the modal

const SendModal = ({ onClose, selectedCard }) => {

    const handleSubmit = async () => {
        try {
            // Check if employee exists
            console.log('Trying to check if employee exists.');
            const response = await fetch('http://localhost:5000/api/isEmployeeExist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: document.getElementById('sendModalInput').value })
            });
    
            // Handle network errors or non-OK responses
            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Failed to fetch employee data. Status: ${response.status}. Details: ${errorDetails}`);
            }
    
            // Parse JSON response
            const data = await response.json();
            console.log('Successfully received employee data from the server:', data);
    
            // Check if data exists and is an array
            if (!Array.isArray(data) || data.length === 0) {
                console.log("Employee does not exist or data format is incorrect.");
                return;  // Exit if no data or invalid format
            }
    
            // Assuming the employee exists in data[0]
            console.log("Employee exists:", data[0].name);
            let name = data[0].name;
            let number_employee = data[0].number_employee;
    
            // Second Fetch: Send to new station
            console.log('AAA');
            const sendStationResponse = await fetch('http://localhost:5000/api/sendStation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    send_worker_name: name,            // Example value
                    send_date: new Date().toISOString(),     // Current date in ISO format
                    send_station: "Packing",                 // Example station value
                    receive_worker: "Jane Doe",              // Optional, can be empty initially
                    receive_date: null,                      // Set as null if not available yet
                    receive_station: null,                   // Set as null if not available yet
                    isFinished: false                        // Initially set as false if incomplete
                })
            });
    
            // Handle errors in the second request
            if (!sendStationResponse.ok) {
                const sendStationErrorDetails = await sendStationResponse.text();
                throw new Error(`Failed to send station data. Status: ${sendStationResponse.status}. Details: ${sendStationErrorDetails}`);
            }
    
            // Log success if both requests succeed
            console.log("Station data successfully sent.");
    
        } catch (err) {
            console.error("Error:", err.message);
        }
    };

    return (
        <div className="modal-container">
            <div className="modal">
                <button className="close-btn" onClick={onClose}>✕</button>

                <h2>שליחה לתחנה הבאה{selectedCard ? selectedCard.employeeNumber : ''}</h2>
                
                <div className="form-group">
                    <label>מספר עובד:</label>
                    <input id='sendModalInput' type="text" />
                </div>

                <button className="submit-btn" onClick={handleSubmit}>המשך</button>
            </div>
        </div>
    );
};

export default SendModal;
