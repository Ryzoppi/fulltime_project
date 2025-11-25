import authenticate from "./authenticate.js"

document.addEventListener('DOMContentLoaded', () => {
  authenticate.validateAuth()
})

document.getElementById('logout').addEventListener('click', () => authenticate.logout())