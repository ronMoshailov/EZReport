    import React from 'react';
    import './loginPage.scss';

    const LoginPage = () => {
        return(
            <div className="modal-container">
                <div className="modal">
                    <button className="close-btn">✕</button>
                    <label htmlFor="employee-number">מספר עובד:</label>
                    <input type="number" id="employee-number" placeholder="Enter number" required></input>
                    <button className="submit-btn">המשך</button>
                </div>
            </div>

        )
    }

    export default LoginPage;