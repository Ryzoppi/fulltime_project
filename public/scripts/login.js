import authenticate from "./authenticate.js";

document.getElementById("login-form").addEventListener('submit', (event) => {
    event.preventDefault()
    
    const email = document.getElementById("email").value
    const senha = document.getElementById("password").value

    authenticate.login({ email, senha })
})