import services from '../services/index.js'

const login = async ({ email, senha }) => {
  const response = await services.api.usuarios.auth({ email, senha })

  if (response.status === 200) {
    localStorage.setItem('keyToken', 'tokenLogado');
    window.location.href = '/dashboard.html';
  } else {
    window.alert("Login Inválido");
  }
}

const logout = async () => {
  localStorage.removeItem('keyToken');
  window.location.href = '/';
}

const isAuthenticated = () => {
  const userToken = localStorage.getItem('keyToken');

  return !!userToken;
}


const validateAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/login.html'; 
  }
}

export default { login, logout, isAuthenticated, validateAuth }