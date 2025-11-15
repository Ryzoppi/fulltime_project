import { url } from "../env.js"

const get = async ({ id }) => {
  try {
    const response = await fetch(`${url}/usuarios/${id}`);
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json(); 
    return result
  } catch (error) {
    console.error(error)
  }
}

const create = async ({ ...data }) => {
  try {
    const response = await fetch(`${url}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    })
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error(error)
  }
}

const update = async ({ id, ...data }) => {
  try {
    const response = await fetch(`${url}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    })
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error(error)
  }
}

const destroy = async ({ id }) => {
  try {
    const response = await fetch(`${url}/usuarios/${id}`, { method: 'DELETE' })
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error(error)
  }
}

export default { get, create, update, destroy }