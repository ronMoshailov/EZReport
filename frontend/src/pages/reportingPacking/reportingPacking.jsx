// Import React libraries
import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Import scss
import './reportingPacking.scss'; 

// Import context
import { LanguageContext } from '../../utils/globalStates';

// Import API
import { displayReportComments, ClosePackingReporting } from '../../utils/APIs/report';

// Import components
import CommentsModal from '../../components/modals/CommentsModal/CommentsModal'; 

// NewReportPage component
const NewReportPage = () => {

  const { direction, text } = useContext(LanguageContext);
  
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
  const producedCount = Number(localStorage.getItem('total'));
  const packedCount = Number(localStorage.getItem('completed'));
  const title = localStorage.getItem('title');

  // Navigate
  const navigate = useNavigate();                         // Router navigation setup

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
    if (employeeNum === null || reportSerialNum === null || reportId === null || producedCount === null || packedCount === null || title){
      navigate('/error');
    }

    // remove listener
    return () => {
      window.removeEventListener('keydown', addEscListener);
    }
  }, []);

  // Handle show comments
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

  const handleCommentModalClose = useCallback(() => setIsCommentsModalOpen(false), []);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!newCompleted || isNaN(newCompleted) || newCompleted <= 0){
        setError(text.invalidQuantity);
        return;
      }

      setError(''); // Clear previous errors
      if ( Number(newCompleted) + packedCount > producedCount) {
        setError(text.oversizeQuantity);
        return;
      }

      const [isTrue, data] = await ClosePackingReporting(employeeNum, reportId, Number(newCompleted), newComment);

      if (isTrue)
        navigate('/dashboard')
      
      setError(text[data]);
    } catch (err) {
      console.error('Error submitting production report:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="new-report-page" style={{direction}}>
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
            <label>{text.packed}</label>
            <input type="text" placeholder={text.packed} value={packedCount} disabled />
          </div>

          <div className="form-group">
            <label>{text.produced}</label>
            <input type="text" placeholder="הוזמנו" value={producedCount} disabled />
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
export default NewReportPage;
