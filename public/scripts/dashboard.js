import authenticate from "./authenticate.js"

document.addEventListener('DOMContentLoaded', () => {
  authenticate.validateAuth()

  if (authenticate.isAdm()) {
    document.getElementById('linkGerenciamento').style.display = 'block'
  }
})

document.getElementById('logout').addEventListener('click', () => authenticate.logout())
