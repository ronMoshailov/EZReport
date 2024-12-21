import { printError } from '../functions'

// Fetch all components from MongoDB
const fetchAllComponents = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/getAllComponents');   // Send a GET request to fetch components data from the server
        
        // Check if the rqeuest succeeded
        if(!response.ok){
            if(response.status === 404)
                return [false, 'compNotFound'];
            if(response.status === 500)
                return [false, 'serverError'];
            return [false, 'unexpectedError']
        }

        // return the data
        const data = await response.json();                                     // Parse the JSON response
        return [true, data.components];
    
    } catch (error) {
        printError(`Unexpected error from the server: ${error.message}`);
        return [false, 'connectionFailed'];
    }
};

// Add new component to the DB
const addComponent = async (componentName, componentNum, componentStock) => {
    try {
        const response = await fetch('http://localhost:5000/api/addComponent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
            body: JSON.stringify({ serialNumber: componentNum, name: componentName, stock: componentStock })  // Pass the input value in the request body
          });

        // Check if the rqeuest succeeded
        if(!response.ok){
            if(response.status === 400)
                return [false, 'invalidParameters'];
            if(response.status === 409)
                return [false, 'compConflict'];
            if(response.status === 500)
                return [false, 'serverError'];
            return [false, 'unexpectedError']
        }

        const data = await response.json();
        return [true, data];

    } catch (error) {
        printError(`Unexpected error from the server: ${error.message}`);
        return [false, 'connectionFailed'];
    }

}

const removeComponent = async (ComponentNum) => {

    try {
        const response = await fetch(`http://localhost:5000/api/removeComponent/${ComponentNum}`, {
            method: 'DELETE',
          });

        // Check if the rqeuest succeeded
        if(!response.ok){
            if(response.status === 400)
                return [false, 'invalidParameters'];
            if(response.status === 404)
                return [false, 'compNotFound'];
            if(response.status === 500)
                return [false, 'serverError'];
            return [false, 'unexpectedError']
        }

        const data = await response.json();
        return [true, data];
          
    } catch (error) {
        printError(`Unexpected error from the server: ${error.message}`);
        return [false, 'connectionFailed'];
    }

}

const addStock = async (componentNum, stock) =>{

    try {
        //
        const response = await fetch(`http://localhost:5000/api/increaseStockBySerialNumber/${componentNum}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
            body: JSON.stringify({ amount: stock })  // Pass the input value in the request body
          });

        // Check if the rqeuest succeeded
        if(!response.ok){
            if(response.status === 400)
                return [false, 'invalidParameters'];
            if(response.status === 404)
                return [false, 'compNotFound'];
            if(response.status === 500)
                return [false, 'serverError'];
            return [false, 'unexpectedError']
        }

          const data = await response.json();
        return [true, data];

    } catch (error) {
        printError(`Unexpected error from the server: ${error.message}`);
        return [false, 'connectionFailed'];
    }


}

const updateStock = async (componentNum, stock) =>{
    try{
        //
        const response = await fetch(`http://localhost:5000/api/updateStock/${componentNum}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
            body: JSON.stringify({ stock })  // Pass the input value in the request body
          });

        // Check if the rqeuest succeeded
        if(!response.ok){
            if(response.status === 400)
                return [false, 'invalidParameters'];
            if(response.status === 404)
                return [false, 'compNotFound'];
            if(response.status === 500)
                return [false, 'serverError'];
            return [false, 'unexpectedError']
        }

        const data = await response.json();
        return [true, data];
    
    } catch (error){
        printError(`Unexpected error from the server: ${error.message}`);
        return [false, 'connectionFailed'];
    }
}



export { fetchAllComponents, addComponent, removeComponent, addStock, updateStock }