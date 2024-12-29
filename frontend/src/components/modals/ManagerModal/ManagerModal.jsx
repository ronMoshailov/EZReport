// Import react libraries
import React, {useContext, useEffect, useState} from 'react';

// Import Toast
import { toast } from 'react-toastify';

// Import scss
import './ManagerModal.scss';

// Import context
import { LanguageContext } from '../../../utils/globalStates';

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

  // useEffect for initialized component
  useEffect(() => {
    window.removeEventListener('keydown', (event) => handleEscKey(event, () => setIsModal(false)));

    return () => {
      window.addEventListener('keydown', (event) => handleEscKey(event, () => setIsModal(false)));
    }
  }, [])
  
  // useContext
  const { direction, text } = useContext(LanguageContext);

  // function for submit any button
  const handleSubmit = async (func, functionType) =>{
    
    setError('');
    const [isTrue, data] = await func();

    if (!isTrue){
      setError(text[data]);
      return;
    }

    switch(functionType){

      case 'addEmployee':
        setIsModal(false);
        break;

      case 'removeEmployee':
        setIsModal(false);
        break;
      
      case 'addComponent':
        setIsModal(false);
        break;

      case 'removeComponent':
        setIsModal(false);
        break;

      case 'addStock':
        setIsModal(false);
        break;
    
    case 'updateStock':
      setIsModal(false);
      break;
  
    case 'calcAverage':
      setIsModal(false);
      toast.info(data.averageTime, {className:"toast-info-message"});
      break;
  }
}
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
            <button className='modalManagerModal' onClick={() => handleSubmit(() => addEmployee(name, Number(number)), 'addEmployee')}>{text.sendNow}</button>
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
            <button className='modalManagerModal' onClick={() => handleSubmit(() => removeEmployee(Number(number)), 'removeEmployee')}>{text.sendNow}</button>
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
            <button className='modalManagerModal' onClick={() => handleSubmit(() => addComponent(name, Number(number), Number(stock)), 'addComponent')}>{text.sendNow}</button>
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
            <button className='modalManagerModal' onClick={() => handleSubmit(() => removeComponent(Number(number)), 'removeComponent')}>{text.sendNow}</button>
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
              <label>כמות להוספה:</label>
              <input type="number" placeholder="הכנס כמות להוספה" value={stock} onChange={(e) => setStock(e.target.value)}/>
            </div>
            <button className='modalManagerModal' onClick={() => handleSubmit(() => addStock(Number(number), Number(stock)), 'addStock')}>{text.sendNow}</button>
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
            <button className='modalManagerModal' onClick={() => handleSubmit(() => updateStock(Number(number), Number(stock)), 'updateStock')}>{text.sendNow}</button>
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
            <button className='modalManagerModal' onClick={() => handleSubmit(() => calcAverage(number), 'calcAverage')}>{text.calc}</button>
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
