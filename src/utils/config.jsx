const BASE_URL = 'https://backend.vivimart.in/api'; // Replace with your base API URL

// Function to fetch categories
export const getCategories = async () => {
  try {   
    const response = await fetch(`${BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers here
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    // Return both status code and response data
    return {
      status: response.status,
      data: responseData
    };
  } catch (error) {
    console.error('Categories API error:', error.message);
    // Re-throw the error with status if needed
    throw error;
  }
};

export const getSubCategories = async () => {
  try {   
    const response = await fetch(`${BASE_URL}/sub-categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers here
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    // Return both status code and response data
    return {
      status: response.status,
      data: responseData
    };
  } catch (error) {
    console.error('Categories API error:', error.message);
    // Re-throw the error with status if needed
    throw error;
  }
};


// export const getCategoriesProduct = async (category) => {
//   const encodedCategory = encodeURIComponent(category); // Encode the category to handle special characters like '&'
//   const url = `https://backend.vivimart.in/api/products/category/${encodedCategory}`; // Updated endpoint

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         // Add any other required headers here if needed, such as authorization tokens
//       },
//     });

//     const responseData = await response.json();

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
//     }

//     // Return both status code and response data
//     return {
//       status: response.status,
//       data: responseData,
//     };
//   } catch (error) {
//     console.error('Categories API error:', error.message);
//     // Re-throw the error if needed
//     throw error;
//   }
// };



export const getSubSubCategories = async (category) => {

  const encodedCategory = encodeURIComponent(category); // Encode the category to handle special characters like '&'
  const url = `${BASE_URL}/sub-sub-categories/subCategory/${encodedCategory}`; // Updated endpoint


  try {   
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers here
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    // Return both status code and response data
    return {
      status: response.status,
      data: responseData
    };
  } catch (error) {
    console.error('Categories API error:', error.message);
    // Re-throw the error with status if needed
    throw error;
  }
};



export const getSubSubCategoriesProduct = async (category) => {
  const encodedCategory = encodeURIComponent(category); // Encode the category to handle special characters like '&'
  const url = `https://backend.vivimart.in/api/products/subsubcategory/${encodedCategory}`; // Updated endpoint

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other required headers here if needed, such as authorization tokens
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    // Return both status code and response data
    return {
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    console.error('Categories API error:', error.message);
    // Re-throw the error if needed
    throw error;
  }
};



export const getBanners = async () => {
  try {   
    const response = await fetch(`${BASE_URL}/banners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers here
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    // Return both status code and response data
    return {
      status: response.status,
      data: responseData
    };
  } catch (error) {
    console.error('Categories API error:', error.message);
    // Re-throw the error with status if needed
    throw error;
  }
};




export const getCartProduct = async (product_id) => {
  const encodedCategory = encodeURIComponent(product_id); // Encode the category to handle special characters like '&'
  const url = `https://backend.vivimart.in/api/products/${encodedCategory}`; // Updated endpoint

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other required headers here if needed, such as authorization tokens
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    // Return both status code and response data
    return {
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    console.error('Categories API error:', error.message);
    // Re-throw the error if needed
    throw error;
  }
};



export const placeOrder = async (orderData) => {
  const url = 'https://backend.vivimart.in/api/orders/add'; // Endpoint for placing orders

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other required headers here, such as authorization tokens
      },
      body: JSON.stringify(orderData), // Convert orderData object to JSON
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    // Return both status code and response data
    return {
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    console.error('Place Order API error:', error.message);
    // Re-throw the error if needed
    throw error;
  }
};



export const getlocationID = async (pincode) => {
  const encodedPincode = encodeURIComponent(pincode); // Encode the pincode to handle special characters
  const url = `https://backend.vivimart.in/api/locations/by-postal-code/${encodedPincode}`; // Updated endpoint

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other required headers here if needed, such as authorization tokens
      },
    });

    // Check if the response is ok
    if (!response.ok) {
      const errorText = await response.text(); // Get error message from response
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const responseData = await response.json(); // Parse the JSON response

    // Return both status code and response data
    return {
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    console.error('Location API error:', error.message); // Log error
    throw error; // Re-throw the error to be handled elsewhere
  }
};




export const getAllProduct = async () => {
  try {   
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers here
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    // Return both status code and response data
    return {
      status: response.status,
      data: responseData
    };
  } catch (error) {
    console.error('Categories API error:', error.message);
    // Re-throw the error with status if needed
    throw error;
  }
};
