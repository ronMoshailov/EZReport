import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './CommentsModal.scss';

import { LanguageContext } from '../../../utils/globalStates';

const CommentsModal = ({ isOpen, onClose, comments }) => {
  
  const { text } = useContext( LanguageContext );

  if (!isOpen) return null;

  
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

CommentsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CommentsModal;
