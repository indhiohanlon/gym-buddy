//creating a utility function for requests to the local server

//defining an asyncronous function and await a response
const request = async (resourceType, options = {}) => {
  //an api endpoint that takes an end file destination
  const endpoint = `http://localhost:3001/api/${resourceType}`;
  const response = await fetch(endpoint, {
    //spread operator takes key value pairs out of object
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    //if there is a body convert to JSON and assign to body key, else key body is undefined
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  //return response and converting JSON into a javascript object
  const result = await response.json();

  return { status: response.status, ...result };
};

export default request;
