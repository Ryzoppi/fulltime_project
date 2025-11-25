import services from '../services/index.js'
import { auth } from '../constants'

const login = async ({ email, senha }) => {
  loginAsAdm({ email, senha })
  if (localStorage.getItem('keyToken')) return

  const response = await services.api.usuarios.auth({ email, senha })

  if (response.status === 200) {
    localStorage.setItem('keyToken', auth.USER_TOKEN);
    window.location.href = '/dashboard.html';
  } else {
    window.alert("Login Inválido");
  }
}

const loginAsAdm = ({ email, senha }) => {
  if (email === "adm@email.com" && senha === "adm123") {
    localStorage.setItem('keyToken', auth.ADM_TOKEN);
    window.location.href = '/dashboard.html';
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