// Import react libraries
import React, { useContext } from 'react';

// Import scss
import './CommentsModal.scss';

// Import context
import { LanguageContext } from '../../../utils/languageProvider';

// CommentsModal conponent
const CommentsModal = ({ isOpen, onClose, comments }) => {
  
  // use Context
  const { text } = useContext( LanguageContext );
  
  // Check if the modal already open
  if (!isOpen)
     return null;
  
  // Render
  return (
    <div className="modal-container-comments">
      <div className="modal-comments">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2 className="modal-title">{text.comments}</h2>
        {comments && comments.length > 0 ? (
          <ol className="comments-list">
            {comments.map((comment, index) => (
              <li key={index} className="comment-item">
                {comment}
              </li>
            ))}
          </ol>
        ) : (
          <p className="no-comments">{text.notAvailableComponents}</p>
        )}
      </div>
    </div>
  );
};

// Export component
export default CommentsModal;
