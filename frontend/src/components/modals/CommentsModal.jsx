import React from 'react';
import PropTypes from 'prop-types';
import './CommentsModal.scss';

const CommentsModal = ({ isOpen, onClose, comments }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-container-comments">
      <div className="modal-comments">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        {/* Modal Title */}
        <h2 className="modal-title">הערות</h2>
        {/* Comments List */}
        {comments && comments.length > 0 ? (
          <ol className="comments-list">
            {comments.map((comment, index) => (
              <li key={index} className="comment-item">
                {comment}
              </li>
            ))}
          </ol>
        ) : (
          <p className="no-comments">אין הערות זמינות</p>
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
