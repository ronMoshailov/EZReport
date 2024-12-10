import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { displayReportComments, sendProductionReport } from '../../components/APIs/report';
import CommentsModal from '../../components/modals/CommentsModal'; 
import './reportingProduction.scss'; 

import { handleEscKey } from '../../components/utils/functions';


const NewReportPage = () => {

  // States
  const [newCompleted, setNewCompleted] = useState(0);                                                          // Holds the new completed quantity
  const [newComment, setNewComment] = useState('');                                                             // Holds the new comment for this reporting
  const [allComments, setAllComments] = useState([]);                                                                 // Holds all the comments for the previous workspace
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);                                        // Show/Hide the comments from the previous workspace
  const [error, setError] = useState('');                                                                       // Holds the error message
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);                                                      // Holds the state if the client in the middle of submitting

  // Constant variables
  const employeeNum = localStorage.getItem('employee_number');
  const reportSerialNum = localStorage.getItem('reportSerialNum');
  const orderedCount = localStorage.getItem('report_orderedCount');
  const reportId = localStorage.getItem('reportId');
  const producedCount = localStorage.getItem('report_producedCount');

  // Navigate
  const navigate = useNavigate();                         // Router navigation setup

  // useEffect
  useEffect(() => {
    window.addEventListener('keydown', addEscListener);                   // Add keydown event listener to listen for Escape key press
    // if (producedCount === null ||  ||  ||  || reportId === null){
    //   navigate('/error');
    // }
  }, []);
  useEffect(() => {
    localStorage.setItem('report_producedCount', producedCount + Number(newCompleted));
  }, [producedCount]);

  // functions
  
  // Add Esc press key listener
  const addEscListener = (event) => handleEscKey(event, () => setIsCommentsModalOpen(false));

  const validateInputs = () => {
    if (!newCompleted || isNaN(newCompleted) || newCompleted <= 0) {
      setSuccess('');
      setError('הזן כמות תקינה');
      return false;
    }
    if (!newComment.trim()) {
      setSuccess('');
      setError('הזן הערה');
      return false;
    }
    return true;
  };

  const handleCommentModalClose = useCallback(() => setIsCommentsModalOpen(false), []);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    setSuccess('');
    try {
      // Check count
      if (!validateInputs()) 
        return;
      
      setError(''); // Clear previous errors

      if ( Number(newCompleted) + producedCount > orderedCount ) {
        setError('הכמות שהוכנסה גבוהה ממה שהוזמן');
        return;
      }

      
      const answer = await sendProductionReport(reportId, employeeNum, Number(newCompleted), newComment)

      if (answer){
        // setProducedCount(producedCount + Number(newCompleted));
        // setNewCompleted(completed + Number(newCompleted));
        setNewCompleted(0); 
        setAllComments([]);
        setError('');
        setSuccess('הפעולה הצליחה');
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
      setAllComments([]); // Clear previous comments
      const fetchedComments = await displayReportComments(reportId);
      setAllComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      alert('שגיאה בהצגת ההערות');
    }
  };











  // // Get date
  // const now = new Date();
  // const year = now.getFullYear();
  // const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  // const day = String(now.getDate()).padStart(2, '0');
  // const formattedDate = `${day}-${month}-${year}`;







  



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

          {/* <div className="form-group">
            <label>תאריך</label>
            <input type="text" placeholder="תאריך" value={formattedDate} disabled />
          </div> */}

          <div className="form-group">
            <label>תקינים</label>
            <input type="text" placeholder="תקינים" value={producedCount} disabled />
          </div>

          <div className="form-group">
            <label>הוזמנו</label>
            <input type="text" placeholder="הוזמנו" value={orderedCount} disabled />
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
              <label className='errorMessage'>{error}</label>
            }
            {success && 
              <label className='successMessage'>{success}</label>
            }
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="buttons-container">
        <button className="btn cancel-btn" onClick={() => navigate('/dashboard')}>
          חזור
        </button>
        <button className="btn showComment-btn" onClick={handleShowComments}>
          הצג הערות
        </button>
        <button className="btn send-btn" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'שולח...' : 'שלח'}
        </button>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={handleCommentModalClose}
        comments={allComments}
      />
    </div>
  );
};

export default NewReportPage;
