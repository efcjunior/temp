const processaConsulta = require('./processa-consulta')

const consulta = (dataSearch) => {    
    return processaConsulta.processaConsulta(dataSearch)
}

module.exports = {
    consulta
}