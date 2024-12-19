import React, {useContext, useState} from 'react';
import './ManagerModal.scss';

import { LanguageContext } from '../../../utils/globalStates';

import { addEmployee, removeEmployee } from '../../../components/APIs/employee';
import { addComponent, removeComponent, addStock, updateStock } from '../../../components/APIs/components';
import { calcAverage } from '../../../components/APIs/report';

const ManagerModal = ({ operationType, setIsModal }) => {

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');

  const { direction, text } = useContext(LanguageContext);

  const handleSubmit = async (func, functionType) =>{
    const data = await func();

    switch(functionType){

      case 'addEmployee':
        if(data.employee){
          setIsModal(false);
        }
        setError(data.message);
        break;

      case 'removeEmployee':
        if(data.message === 'Employee removed successfully'){
          setIsModal(false);
        }
        setError(data.message);
        break;
      
      case 'addComponent':
        if(data.component){
          setIsModal(false);
        }
        setError(data.message);
        break;

      case 'removeComponent':
        if(data.message === 'Component removed successfully'){
          setIsModal(false);
        }
        setError(data.message);
        break;

      case 'addStock':
        if(data.stock){
          setIsModal(false);
        }
        setError(data.message);
        break;
    
    case 'updateStock':
      if(data.stock){
        setIsModal(false);
      }
      setError(data.message);
      break;
  
    case 'calcAverage':
      if(data){
        console.log(data);
        setIsModal(false);
      }
      setError(data.message);
      break;


  }
}
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



export default ManagerModal;
