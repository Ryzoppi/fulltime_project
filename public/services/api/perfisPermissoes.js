import { url } from "../env.js"

const create = async ({ ...data }) => {
  try {
    const response = await fetch(`${url}/perfis_permissoes`, {
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

const destroy = async ({ id }) => {
  try {
    const response = await fetch(`${url}/perfis_permissoes/${id}`, { method: 'DELETE' })
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error(error)
  }
}

export default { create, destroy }