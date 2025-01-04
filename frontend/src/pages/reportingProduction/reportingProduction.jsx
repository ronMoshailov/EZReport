// Import React libraries
import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Toast
import { toast } from 'react-toastify';

// Import scss
import './reportingProduction.scss'; 

// Import context
import { LanguageContext } from '../../utils/languageProvider';

// Import API
import { displayReportComments, CloseProductionReporting } from '../../utils/APIs/report';

// Import components
import CommentsModal from '../../components/modals/CommentsModal/CommentsModal'; 

// Import functions
import { handleEscKey } from '../../utils/functions';

// NewReportingPage component
const NewReportingPage = () => {

  // States
  const [newCompleted, setNewCompleted] = useState('');                                                         // Holds the new completed quantity
  const [newComment, setNewComment] = useState('');                                                             // Holds the new comment for this reporting
  const [allComments, setAllComments] = useState([]);                                                           // Holds all the comments for the previous workspace
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);                                        // Show/Hide the comments from the previous workspace
  const [error, setError] = useState('');                                                                       // Holds the error message
  const [isSubmitting, setIsSubmitting] = useState(false);                                                      // Holds the state if the client in the middle of submitting

  // Constant variables
  const employeeNum = localStorage.getItem('employee_number');
  const reportSerialNum = localStorage.getItem('serialNum');
  const reportId = localStorage.getItem('reportId');
  const orderedCount = Number(localStorage.getItem('total'));
  const producedCount = Number(localStorage.getItem('completed'));
  const title = localStorage.getItem('title');

  // useNavigate
  const navigate = useNavigate();

  const { direction, text } = useContext(LanguageContext);
  
    // useEffect for initialized component
    useEffect(() => {
      // Add ESC listener
      const addEscListener = (event) => {
        if (event.key === 'Escape') {
          setIsCommentsModalOpen(false);
        }
      };
      window.addEventListener('keydown', addEscListener);
  
      // Check data valid for this page
      if (employeeNum === null || reportSerialNum === null || reportId === null || orderedCount === null || producedCount === null || title === null){
        navigate('/error');
      }
  
      // remove listener
      return () => {
        window.removeEventListener('keydown', addEscListener);
      }
    }, []);
    
  // Functions
  const handleShowComments = async () => {
    setError('');
    setIsCommentsModalOpen(true);
    setAllComments([]); // Clear previous comments
    const [isTrue, fetchedComments] = await displayReportComments(reportId);
    if(isTrue){
      setAllComments(fetchedComments);
      return;
    }
    else{
      setError(fetchedComments);
      setIsCommentsModalOpen(false);
    }
  };

  // show component modal with useCallback
  const handleCommentModalClose = useCallback(() => setIsCommentsModalOpen(false), []);

  // Handle submit
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!newCompleted || isNaN(newCompleted) || newCompleted <= 0){
        setError(text.invalidQuantity);
        return;
      }

      setError(''); // Clear previous errors
      if ( Number(newCompleted) + producedCount > orderedCount) {
        setError(text.oversizeQuantity);
        return;
      }

      const [isTrue, data] = await CloseProductionReporting(employeeNum, reportId, Number(newCompleted), newComment);

      if (isTrue){
        toast.success(text.sendReportingSuccessfully, {className:"toast-success-message"});    // Show display message
        navigate('/dashboard')        
      }
      
      setError(text[data]);
    } catch (err) {
      console.error('Error submitting production report:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render
  return (
    <div className="new-reporting-production-page" style={{direction}}>
      <h1>{title}</h1>
      <div className="form-container">
        {/* Right Side */}
        <div className="form-column">
          <div className="form-group">
            <label>{text.employeeNum}</label>
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

// Export component
export default NewReportingPage;
