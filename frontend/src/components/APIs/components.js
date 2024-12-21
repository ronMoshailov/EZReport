

// Fetch all components from MongoDB
const fetchAllComponents = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/getAllComponents');   // Send a GET request to fetch components data from the server
        const data = await response.json();                                     // Parse the JSON response
        return [true, data.components];
    
    } catch (err) {
        return [false, err.message];
    }
};

const addComponent = async (componentName, componentNum, componentStock) => {
    const response = await fetch('http://localhost:5000/api/addComponent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
        body: JSON.stringify({ serialNumber: componentNum, name: componentName, stock: componentStock })  // Pass the input value in the request body
      });
      const data = await response.json();
      return data;
}

const removeComponent = async (ComponentNum) => {
    const response = await fetch(`http://localhost:5000/api/removeComponent/${ComponentNum}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
}

const addStock = async (componentNum, stock) =>{
    const response = await fetch(`http://localhost:5000/api/increaseStockBySerialNumber/${componentNum}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
        body: JSON.stringify({ amount: stock })  // Pass the input value in the request body
      });
      const data = await response.json();
      return data;
}

const updateStock = async (componentNum, stock) =>{
    try{
        const response = await fetch(`http://localhost:5000/api/updateStock/${componentNum}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },  // Set content type to JSON
            body: JSON.stringify({ stock })  // Pass the input value in the request body
          });
          const data = await response.json();
          return data;
    
    } catch (error){
        console.error(error.message)
    }

}



export { fetchAllComponents, addComponent, removeComponent, addStock, updateStock }