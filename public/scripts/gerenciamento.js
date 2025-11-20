import services from "../services/index.js"

import authenticate from "./authenticate.js"

document.addEventListener('DOMContentLoaded', () => {
    authenticate.validateAuth()
})

const dados = await services.api.usuarios.get({ id: '' })

console.log(dados)