// Import react libraries
import React, {useContext, useEffect, useState} from 'react';

// Import Toast
import { toast } from 'react-toastify';

// Import scss
import './ManagerModal.scss';

// Import context
import { LanguageContext } from '../../../utils/languageProvider';

// Import API
import { addEmployee, removeEmployee } from '../../../utils/APIs/employee';
import { addComponent, removeComponent, addStock, updateStock } from '../../../utils/APIs/components';
import { calcAverage } from '../../../utils/APIs/report';

// Import functions
import { handleEscKey, handleEnterKey } from '../../../utils/functions'

// ManagerModal component
const ManagerModal = ({ operationType, setIsModal }) => {

  // useState
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect for initialized component
  useEffect(() => {
    window.addEventListener('keydown', (event) => handleEscKey(event, () => setIsModal(false)));

    return () => {
    window.removeEventListener('keydown', (event) => handleEscKey(event, () => setIsModal(false)));
    }
  }, [])
  
  // useContext
  const { direction, text } = useContext(LanguageContext);

  // function for submit any button
  const handleSubmit = async (func, functionType) =>{
    
    setError('');
    if (isSubmitting) return;
    setIsSubmitting(true);
    const [isTrue, data] = await func();

    if (!isTrue){
      setError(text[data]);
      return;
    }

    switch(functionType){

      case 'addEmployee':
        setIsModal(false);
        toast.success(text.successAddedEmployee, {className:"toast-success-message"});     // Show display message  
        break;

      case 'removeEmployee':
        setIsModal(false);
        toast.success(text.successRemovedEmployee, {className:"toast-success-message"});     // Show display message  
        break;
      
      case 'addComponent':
        setIsModal(false);
        toast.success(text.successAddedComponent, {className:"toast-success-message"});     // Show display message  
        break;

      case 'removeComponent':
        setIsModal(false);
        toast.success(text.successRemovedComponent, {className:"toast-success-message"});     // Show display message  
        break;

      case 'addStock':
        setIsModal(false);
        toast.success(text.successUpdateStock, {className:"toast-success-message"});     // Show display message  
        break;
    
    case 'updateStock':
      setIsModal(false);
      toast.success(text.successUpdateStock, {className:"toast-success-message"});     // Show display message  
      break;
  
    case 'calcAverage':
      setIsModal(false);
      if (data.averageTime){
        toast.info(data.averageTime, {className:"toast-info-message"});     // Show display message
      }
      else{
        toast.info(text.noDataFound, {className:"toast-info-message"});     // Show display message
      }
      break;
  }
  setIsSubmitting(false);
}

const textSubmitting = isSubmitting ? text.wait : text.sendNow;

  // Render section
  const renderModalContent = () => {
    switch (operationType) {
      case 'addEmployee':
        return (
          <div style={{direction}}>
            <h2>
              {text.addEmployee}
            </h2>
            <div className="input-group">
              <label> {text.employeeName}: </label>
              <input type="text" placeholder={text.enterEmployeeName} value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="input-group">
              <label> {text.employeeNum}: </label>
              <input type="number" placeholder={text.enterEmployeeNum} value={number}onChange={(e) => setNumber(e.target.value)}/>
            </div>
            <button className='modalManagerModal' onClick={() => handleSubmit(() => addEmployee(name, Number(number)), 'addEmployee')}>{textSubmitting}</button>
            {error && <label className='errorMessage'>{error}</label>}
          </div>
        );
      case 'removeEmployee':
        return (
          <div style={{direction}}>
            <h2>{text.removeEmployee}</h2>
            <div className="input-group">
              <label>{text.employeeNum}:</label>
              <input type="number" placeholder={text.enterEmployeeNum} value={number} onChange={(e) => setNumber(e.target.value)}/>
            </div>
            <button className='modalManagerModal' onClick={() => handleSubmit(() => removeEmployee(Number(number)), 'removeEmployee')}>{textSubmitting}</button>
            {error && <label className='errorMessage'>{error}</label>}
          </div>
        );
      case 'addComponent':
        return (
          <div style={{direction}}>
            <h2>{text.addComponent}</h2>
            <div className="input-group">
              <label>{text.componentName}:</label>
              <input type="text" placeholder={text.enterComponentName} value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="input-group">
              <label>{text.componentNum}:</label>
              <input type="text" placeholder={text.addComponentNum} value={number} onChange={(e) => setNumber(e.target.value)}/>
            </div>
            <div className="input-group">
              <label>{text.stock}:</label>
              <input type="number" placeholder={text.enterQuantity} value={stock} onChange={(e) => setStock(e.target.value)}/>
            </div>
            <button className='modalManagerModal' onClick={() => handleSubmit(() => addComponent(name, Number(number), Number(stock)), 'addComponent')}>{textSubmitting}</button>
            {error && <label className='errorMessage'>{error}</label>}
          </div>
        );
      case 'removeComponent':
        return (
          <div style={{direction}}>
            <h2>{text.removeComponent}</h2>
            <div className="input-group">
              <label>{text.componentNum}:</label>
              <input type="text" placeholder={text.addComponentNum} value={number} onChange={(e) => setNumber(e.target.value)}/>
            </div>
            <button className='modalManagerModal' onClick={() => handleSubmit(() => removeComponent(Number(number)), 'removeComponent')}>{textSubmitting}</button>
            {error && <label className='errorMessage'>{error}</label>}
          </div>
        );
      case 'addStock':
        return (
          <div style={{direction}}>
            <h2>{text.addingStock}</h2>
            <div className="input-group">
              <label>{text.componentNum}:</label>
              <input type="text" placeholder={text.enterNumberComponent} value={number} onChange={(e) => setNumber(e.target.value)}/>
            </div>
            <div className="input-group">
              <label>{text.countToAdd}:</label>
              <input type="number" placeholder={text.enterCountToAdd} value={stock} onChange={(e) => setStock(e.target.value)}/>
            </div>
            <button className='modalManagerModal' onClick={() => handleSubmit(() => addStock(Number(number), Number(stock)), 'addStock')}>{textSubmitting}</button>
            {error && <label className='errorMessage'>{error}</label>}
          </div>
        );
      case 'updateStock':
        return (
          <div style={{direction}}>
            <h2>{text.updatingStock}</h2>
            <div className="input-group">
              <label>{text.componentNum}:</label>
              <input type="text" placeholder={text.enterNumberComponent} value={number} onChange={(e) => setNumber(e.target.value)} />
            </div>
            <div className="input-group">
              <label>{text.quantity}:</label>
              <input type="number" placeholder={text.enterQuantity} value={stock} onChange={(e) => setStock(e.target.value)}/>
            </div>
            <button className='modalManagerModal' onClick={() => handleSubmit(() => updateStock(Number(number), Number(stock)), 'updateStock')}>{textSubmitting}</button>
            {error && <label className='errorMessage'>{error}</label>}
          </div>
        );
      case 'calcAve':
        return (
          <div style={{direction}}>
            <h2>{text.calcAve}</h2>
            <div className="input-group">
              <label>{text.pakaNumber}:</label>
              <input type="text" placeholder={text.EnterPaka} value={number} onChange={(e) => setNumber(e.target.value)}/>
            </div>
            <button className='modalManagerModal' onClick={() => handleSubmit(() => calcAverage(number), 'calcAverage')}>{textSubmitting}</button>
            {error && <label className='errorMessage'>{error}</label>}
          </div>
        );
      default:
        return <p>{text.operationNotFound}</p>;
    }
  };

  // Render
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-btn" onClick={() => setIsModal(false)}>
          ✕
        </button>
        {renderModalContent()}
      </div>
    </div>
  );
};

// Export component
export default ManagerModal;
