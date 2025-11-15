import services from "./services/index.js"

const dados = await services.api.usuarios.get({ id: '' })

console.log(dados)