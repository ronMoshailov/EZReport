import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { displayReportComments, CloseProductionReporting } from '../../components/APIs/report';
import CommentsModal from '../../components/modals/CommentsModal/CommentsModal'; 
import './reportingProduction.scss'; 

import { handleEscKey } from '../../utils/functions';

import { LanguageContext } from '../../utils/globalStates';

const NewReportingPage = () => {

  // States
  const [newCompleted, setNewCompleted] = useState('');                                                          // Holds the new completed quantity
  const [newComment, setNewComment] = useState('');                                                             // Holds the new comment for this reporting
  const [allComments, setAllComments] = useState([]);                                                                 // Holds all the comments for the previous workspace
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);                                        // Show/Hide the comments from the previous workspace
  const [error, setError] = useState('');                                                                       // Holds the error message
  const [isSubmitting, setIsSubmitting] = useState(false);                                                      // Holds the state if the client in the middle of submitting

  // Constant variables
  const employeeNum = localStorage.getItem('employee_number');
  const reportSerialNum = localStorage.getItem('serialNum');
  const reportId = localStorage.getItem('reportId');
  const orderedCount = Number(localStorage.getItem('total'));
  const producedCount = Number(localStorage.getItem('completed'));
  
  // Navigate
  const navigate = useNavigate();                         // Router navigation setup

  const { text } = useContext(LanguageContext);
  
  // useEffect
  useEffect(() => {
    window.addEventListener('keydown', addEscListener);                   // Add keydown event listener to listen for Escape key press
    if (employeeNum === null || reportSerialNum === null || reportId === null || orderedCount === null || producedCount === null){
      navigate('/error');
    }
  }, []);

  // Functions
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
      if ( Number(newCompleted) + producedCount > orderedCount) {
        setError('הכמות שהוכנסה גבוהה ממה שהוזמן');
        return;
      }

      const answer = await CloseProductionReporting(employeeNum, reportId, Number(newCompleted), newComment);

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
            <label>{text.employeeNumToReport}</label>
            <input type="text" placeholder="הכנס מספר עובד" value={employeeNum} disabled />
          </div>

          <div className="form-group">
            <label>{text.catalogNumber}</label>
            <input type="text" placeholder="הכנס מקט" value={reportSerialNum} disabled />
          </div>

          <div className="form-group">
            <label>{text.good}</label>
            <input type="text" placeholder={text.good} value={producedCount} disabled />
          </div>

          <div className="form-group">
            <label>{text.ordered}</label>
            <input type="text" placeholder={text.ordered} value={orderedCount} disabled />
          </div>

        </div>

        {/* Left Side */}
        <div className="form-column">
          <div className="form-group">
            <label>{text.quantitySize}</label>
            <input type="Number" placeholder={text.quantitySize} value={newCompleted}
              onChange={(e) => {
                setNewCompleted(e.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label>{text.comments}</label>
            <input id="comments" type="text" placeholder={text.comments} value={newComment}
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
          {text.return}
        </button>
        <button className="btn showComment-btn" onClick={handleShowComments}>
          {text.showComments}
        </button>
        <button className="btn send-btn" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? `${text.sending}...` : text.sendNow}
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

export default NewReportingPage;
