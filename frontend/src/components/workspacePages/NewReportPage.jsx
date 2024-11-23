import React, { useEffect, useState, useCallback } from 'react';
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
  const [employeeNum, setEmployeeNum] = useState(localStorage.getItem('employee_number') || '');
  const [reportSerialNum, setReportSerialNum] = useState(localStorage.getItem('report_serialNum') || '');
  const [reportOrdered, setReportOrdered] = useState(Number(localStorage.getItem('report_ordered') || 0));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${day}-${month}-${year}`;

  // useEffect
  useEffect(() => {
    setReportId(localStorage.getItem('report_id') || 0);
    setCompleted(Number(localStorage.getItem('report_completed') || 0));
  }, []);

  const validateInputs = () => {
    if (!newCompleted || isNaN(newCompleted) || newCompleted <= 0) {
      setError('הזן כמות תקינה');
      return false;
    }
    if (!newComment.trim()) {
      setError('הזן הערה');
      return false;
    }
    return true;
  };

  // Router navigation setup
  const navigate = useNavigate();

  // Handle delete
  const handleDelete = () => {
    navigate('/dashboard');
  };

  const handleCommentModalClose = useCallback(() => setIsCommentsModalOpen(false), []);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Check count
      if (!validateInputs()) {
        return;
      }
      setError(''); // Clear previous errors

      if ( Number(newCompleted) + completed > reportOrdered ) {
        alert('הכמות שהוכנסה גבוהה ממה שהוזמן');
        return;
      }
      console.log(reportId, employeeNum, newCompleted, newComment);
      const answer = await sendProductionReport(reportId, employeeNum, Number(newCompleted), newComment)
      console.log(`answer: ${answer}`);
      if (answer){
        setCompleted(completed + Number(newCompleted));
        localStorage.setItem('report_completed', completed + Number(newCompleted));
        // setNewCompleted(completed + Number(newCompleted));
        setError('');
        return;
      }
      setError('Failed');
    } catch (err) {
      console.error('Error submitting production report:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle show comments
  const handleShowComments = async () => {
    try {
      setIsCommentsModalOpen(true);
      setComments([]); // Clear previous comments
      const fetchedComments = await displayReportComments(reportId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      alert('שגיאה בהצגת ההערות');
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
            <input type="text" placeholder="הכנס מספר עובד" value={employeeNum} disabled />
          </div>

          <div className="form-group">
            <label>מקט</label>
            <input type="text" placeholder="הכנס מקט" value={reportSerialNum} disabled />
          </div>

          <div className="form-group">
            <label>תאריך</label>
            <input type="text" placeholder="תאריך" value={formattedDate} disabled />
          </div>

          <div className="form-group">
            <label>תקינים</label>
            <input type="text" placeholder="תקינים" value={completed} disabled />
          </div>

          <div className="form-group">
            <label>הוזמנו</label>
            <input type="text" placeholder="הוזמנו" value={reportOrdered} disabled />
          </div>

        </div>

        {/* Left Side */}
        <div className="form-column">
          <div className="form-group">
            <label>כמות יחידות</label>
            <input type="Number" placeholder="כמות יחידות" value={newCompleted}
              onChange={(e) => {
                setNewCompleted(e.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label>הערות</label>
            <input id="comments" type="text" placeholder="הערות" value={newComment}
              onChange={(e) => {setNewComment(e.target.value)}}
            />
          </div>

          <div className='form-group'>
            {error && 
              <label id='errorMsg'>{error}</label>
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
        <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'שולח...' : 'שלח'}
        </button>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={handleCommentModalClose}
        comments={comments}
      />
    </div>
  );
};

export default NewReportPage;
