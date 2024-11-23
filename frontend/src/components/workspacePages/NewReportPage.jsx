import React, { useEffect, useState } from 'react';
import './newReportPage.scss'; // Import the styles
import { useNavigate } from 'react-router-dom';
import { displayReportComments } from '../APIs/API_report';
import CommentsModal from '../modals/CommentsModal'; // Import the CommentsModal component
import { sendProductionReport } from '../APIs/API_report';

const NewReportPage = () => {
  // States
  const [newCompleted, setNewCompleted] = useState(0);
  const [comments, setComments] = useState([]); // Store comments as an array
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false); // State to toggle modal visibility
  const [newComment, setNewComment] = useState('');
  const [reportId, setReportId] = useState(0);
  const [completed, setCompleted] = useState(Number(localStorage.getItem('report_completed')));
  const [error, setError] = useState('');

  // Get date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${day}-${month}-${year}`;

  // useEffect
  useEffect(() => {
    const report_id = localStorage.getItem('report_id');
    setReportId(report_id);
  }, []);

  // Router navigation setup
  const navigate = useNavigate();

  // Handle delete
  const handleDelete = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async () => {
    // Check count
    if (newCompleted <= 0) {
      alert('הכמות לא תקינה');
      return;
    }
    if ( Number(newCompleted) + completed > Number(localStorage.getItem('report_ordered')) ) {
      alert('הכמות שהוכנסה גבוהה ממה שהוזמן');
      return;
    }
    const employee_num = localStorage.getItem('employee_number');
    console.log(reportId, employee_num, newCompleted, newComment);
    const answer = sendProductionReport(reportId, employee_num, Number(newCompleted), newComment)
    if (answer){
      setCompleted(completed + Number(newCompleted));
      localStorage.setItem('report_completed', completed + Number(newCompleted));
      // setNewCompleted(completed + Number(newCompleted));
      setError('');
      return;
    }
    setError('Failed');
  };

  // Handle show comments
  const handleShowComments = async () => {
    try {

      if (!reportId) {
        console.error('No report_id found in localStorage');
        alert('Please select a report first.');
        return;
      }

      // Fetch comments
      const fetchedComments = await displayReportComments(reportId);

      // Update the comments state
      setComments(fetchedComments);

      // Open the comments modal
      setIsCommentsModalOpen(true);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      alert('An error occurred while fetching comments. Please try again later.');
    }
  };

  return (
    <div className="new-report-page">
      <h1>דיווח חדש מספר 0007</h1>

      <div className="form-container">
        {/* Right Side */}
        <div className="form-column">
          <div className="form-group">
            <label>מספר עובד לדיווח</label>
            <input
              type="text"
              placeholder="הכנס מספר עובד"
              value={localStorage.getItem('employee_number')}
              disabled
            />
          </div>

          <div className="form-group">
            <label>מקט</label>
            <input
              type="text"
              placeholder="הכנס מקט"
              value={localStorage.getItem('report_serialNum')}
              disabled
            />
          </div>

          <div className="form-group">
            <label>תאריך</label>
            <input type="text" placeholder="תאריך" value={formattedDate} disabled />
          </div>

          <div className="form-group">
            <label>תקינים</label>
            <input
              type="text"
              placeholder="תקינים"
              value={completed}
              disabled
            />
          </div>

          <div className="form-group">
            <label>הוזמנו</label>
            <input
              type="text"
              placeholder="הוזמנו"
              value={localStorage.getItem('report_ordered')}
              disabled
            />
          </div>

        </div>

        {/* Left Side */}
        <div className="form-column">
          <div className="form-group">
            <label>כמות יחידות</label>
            <input
              type="Number"
              placeholder="כמות יחידות"
              value={newCompleted}
              onChange={(e) => {
                setNewCompleted(e.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label>הערות</label>
            <input
              id="comments"
              type="text"
              placeholder="הערות"
              value={newComment}
              onChange={(e) => {setNewComment(e.target.value)}}
            />
          </div>

          <div className='form=group'>
            {error && 
              <label>{error}</label>
            }
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="buttons-container">
        <button className="delete-button" onClick={handleDelete}>
          מחק
        </button>
        <button className="comment-button" onClick={handleShowComments}>
          הצג הערות
        </button>
        <button className="submit-button" onClick={handleSubmit}>
          שלח
        </button>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        comments={comments}
      />
    </div>
  );
};

export default NewReportPage;
