import React from 'react';
import './newReportPage.scss';  // Import the styles

const NewReportPage = ({workspace}) => {

    return (
        <div className="new-report-page">
            <h1>דיווח חדש מספר 0007</h1>
            {/* Form field for employee number */}
            <div className="form-group">
                <label>מספר עובד לדיווח</label>
                <input type="text" placeholder="הכנס מספר עובד" required />
            </div>

            {/* Form field for product number */}
            <div className="form-group">
                <label>מקט</label>
                <input type="text" placeholder="הכנס מקט" />
            </div>

            <div className="form-group">
                <label>תקינים</label>
                <input type="text" placeholder="תקינים" />
            </div>

            <div className="form-group">
                <label>תאריך</label>
                <input type="text" placeholder="תאריך" />
            </div>

            <div className="form-group">
                <label>כמות יחידות</label>
                <input type="text" placeholder="כמות יחידות" />
            </div>

            <div className="form-group">
                <label>הערות</label>
                <input id="comments" type="text" placeholder="הערות" />
            </div>
            
            <div className="form-group">
                <label>מספר עובד לדיווח</label>
                <input type="text" placeholder="מספר עובד לדיווח" />
            </div>

            {/* Add other fields as necessary */}
        </div>
    );
};

export default NewReportPage;
