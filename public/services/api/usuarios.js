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

const auth = async ({ ...data }) => {
  const response = await fetch(`${url}/usuarios/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  });

  const result = await response.json(); // pega o corpo da resposta

  return {
    status: response.status,
    userId: result.userId  // supondo que o backend retorne { userId: 5, mensagem: "..." }
  };
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

const updateLayout = async (userId, layout) => {
  const response = await fetch(`${url}/usuarios/${userId}/layout`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ layout })
  });

  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  return await response.json();
}

export default { get, auth, create, update, destroy, updateLayout }