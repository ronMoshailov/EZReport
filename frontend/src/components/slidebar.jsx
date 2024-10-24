import React from 'react';
import './slidebar.scss';  // Import the sidebar styles

const Slidebar = () => {
  return (
    <div className="sidebar-content">
      <a href="/">בית</a>
      <a href="/other">אחר</a>
      <a href="/settings">הגדרות</a>
      <a href="/help">עזרה</a>
    </div>
  );
};

export default Slidebar;
