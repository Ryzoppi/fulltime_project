import { url } from "../env.js"

const get = async ({ id }) => {
  try {
    const response = await fetch(`${url}/logs_de_atividade/${id}`);
    
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
    const response = await fetch(`${url}/logs_de_atividade`, {
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

export default { get, create }