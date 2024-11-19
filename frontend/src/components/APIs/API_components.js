

// Fetch all components from MongoDB
const fetchAllComponents = async () => {
    try {
    
        const response = await fetch('http://localhost:5000/api/getAllComponent');   // Send a GET request to fetch components data from the server
        const data = await response.json();                                     // Parse the JSON response
        return [true, data];
    
    } catch (err) {
        return [false, err.message];
    }
    };


export { fetchAllComponents }