import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { displayReportComments, ClosePackingReporting } from '../../components/APIs/report';
import CommentsModal from '../../components/modals/CommentsModal'; 
import './reportingPacking.scss'; 

import { handleEscKey } from '../../components/utils/functions';

const NewReportPage = () => {

  // States
  const [newCompleted, setNewCompleted] = useState(0);                                                          // Holds the new completed quantity
  const [newComment, setNewComment] = useState('');                                                             // Holds the new comment for this reporting
  const [allComments, setAllComments] = useState([]);                                                                 // Holds all the comments for the previous workspace
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);                                        // Show/Hide the comments from the previous workspace
  const [error, setError] = useState('');                                                                       // Holds the error message
  const [isSubmitting, setIsSubmitting] = useState(false);                                                      // Holds the state if the client in the middle of submitting

  // Constant variables
  const employeeNum = localStorage.getItem('employee_number');
  const reportSerialNum = localStorage.getItem('serialNum');
  const reportId = localStorage.getItem('reportId');
  const producedCount = Number(localStorage.getItem('total'));
  const packedCount = Number(localStorage.getItem('completed'));

  // Navigate
  const navigate = useNavigate();                         // Router navigation setup

  // useEffect
  useEffect(() => {
    window.addEventListener('keydown', addEscListener);                   // Add keydown event listener to listen for Escape key press
    if (employeeNum === null || reportSerialNum === null || reportId === null || producedCount === null || packedCount === null){
      navigate('/error');
    }
  }, []);

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

  const addEscListener = (event) => handleEscKey(event, () => setIsCommentsModalOpen(false));

  const handleCommentModalClose = useCallback(() => setIsCommentsModalOpen(false), []);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!newCompleted || isNaN(newCompleted) || newCompleted <= 0){
        setError('הזן כמות תקינה');
        return;
      }

      setError(''); // Clear previous errors
      if ( Number(newCompleted) + packedCount > producedCount) {
        setError('הכמות שהוכנסה גבוהה ממה שהוזמן');
        return;
      }

      const answer = await ClosePackingReporting(employeeNum, reportId, Number(newCompleted), newComment);

      if (answer)
        navigate('/dashboard')
      
      setError('Failed');
    } catch (err) {
      console.error('Error submitting production report:', err.message);
    } finally {
      setIsSubmitting(false);
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
