import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendProductionReport, displayReportComments } from '../../components/APIs/report';
import CommentsModal from '../../components/modals/CommentsModal'; 
import './reportingPacking.scss'; 

import { handleEscKey } from '../../components/utils/functions';


const NewReportPage = () => {

  // States
  const [newCompleted, setNewCompleted] = useState(0);                                                          // Holds the new completed quantity
  const [newComment, setNewComment] = useState('');                                                             // Holds the new comment for this reporting
  const [comments, setComments] = useState([]);                                                                 // Holds all the comments for the previous workspace
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);                                        // Show/Hide the comments from the previous workspace
  const [error, setError] = useState('');                                                                       // Holds the error message
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);                                                      // Holds the state if the client in the middle of submitting

    // Constant variables
    const employeeNum = localStorage.getItem('employee_number');
    const reportSerialNum = localStorage.getItem('serialNum');
    const reportId = localStorage.getItem('reportId');
    const producedCount = localStorage.getItem('total');
    const packedCount = localStorage.getItem('completed');

  const navigate = useNavigate();                         // Router navigation setup

  // Get date
  // const now = new Date();
  // const year = now.getFullYear();
  // const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  // const day = String(now.getDate()).padStart(2, '0');
  // const formattedDate = `${day}-${month}-${year}`;

  // useEffect
  useEffect(() => {
    window.addEventListener('keydown', addEscListener);                   // Add keydown event listener to listen for Escape key press
    // if (packedCount === null || employeeNum === null || reportSerialNum === null || orderedCount === null || reportId === null){
    //   navigate('/error');
    // }
  }, []);

  useEffect(() => {
    localStorage.setItem('report_packedCount', packedCount + Number(newCompleted));
  }, [packedCount]);

  const handleEscPress = () => {
    setIsCommentsModalOpen(false);
  }

  // Add Esc press key listener
  const addEscListener = (event) => handleEscKey(event, handleEscPress);


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
    // if (isSubmitting) return;
    // setIsSubmitting(true);
    
    // setSuccess('');
    // try {
    //   // Check count
    //   if (!validateInputs()) 
    //     return;
      
    //   setError(''); // Clear previous errors

    //   if ( Number(newCompleted) + packedCount > orderedCount ) {
    //     setError('הכמות שהוכנסה גבוהה ממה שהוזמן');
    //     return;
    //   }

      
    //   const answer = await sendProductionReport(reportId, employeeNum, Number(newCompleted), newComment)

    //   if (answer){
    //     setPackedCount(packedCount + Number(newCompleted));
    //     // setNewCompleted(completed + Number(newCompleted));
    //     setNewCompleted(0); 
    //     setComments([]);
    //     setError('');
    //     setSuccess('הפעולה הצליחה');
    //     return;
    //   }
    //   setError('Failed');
    // } catch (err) {
    //   console.error('Error submitting production report:', err.message);
    // } finally {
    //   setIsSubmitting(false);
    // }
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

          {/* <div className="form-group">
            <label>תאריך</label>
            <input type="text" placeholder="תאריך" value={formattedDate} disabled />
          </div> */}

          <div className="form-group">
            <label>נארזו</label>
            <input type="text" placeholder="תקינים" value={packedCount} disabled />
          </div>

          <div className="form-group">
            <label>יוצרו</label>
            <input type="text" placeholder="הוזמנו" value={producedCount} disabled />
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
        comments={comments}
      />
    </div>
  );
};

export default NewReportPage;
