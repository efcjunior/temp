const sha256 = require('sha256')
const fs = require('fs')
const path = require('path')

class Config {
    constructor(searchSize, continuitySize, matchesRequired){
        this.searchSize = searchSize
        this.continuitySize = continuitySize
        this.matchesRequired = matchesRequired
    }
}

class ValuePair {
    constructor(data){
        let fields = data.split(';')
        this.dh = fields[0]        
        this.left = parseFloat(fields[1].replace(/,/g, '.'))
        this.right = parseFloat(fields[2].replace(/,/g, '.'))
        this.variations = this.getVariations(this.left,this.right)        
        this.id = sha256(this.toString())
    }

    toString(){
        return this.dh + this.left + this.right
    }

    getCoefficient(left, right){
        return Math.abs(left - right)
    }

    getVariations(left, right){
        let coefficient = this.getCoefficient(left, right)
        return  [
            coefficient - 0.5,
            coefficient,
            coefficient + 0.5]
    }

    isSearchCoefficientMatches(left, right){
        let searchCoefficient = this.getCoefficient(left, right)
        return this.variations.includes(searchCoefficient)
    }
}

const createValuePairFromFile = function (){
    let values = []
    
    let file = fs.readFileSync(path.join(__dirname,'import.txt'),'utf8')
    file.split('\n').forEach(line => {
        values.push(new ValuePair(line))
    })
    return values
}
const getMatchesTotalFromSearch = function(arrayStored, arraySearch){    
    let matchesCount = 0    
    if(arrayStored.length >=  arraySearch.length){
        for(let i = 0; i < arraySearch.length; i++){
            if(arrayStored[i].isSearchCoefficientMatches(arraySearch[i][0], arraySearch[i][1])){
                matchesCount++
            }    
        }
    }   
    //console.log('Match total: ' + matchesCount)
    return matchesCount
}

const processaConsulta = (dataSearch) => {
    let config
    switch(13){
        case 13:
            config = new Config(13,8,3)
            break;
    }    
    let arraySearch = dataSearch
    let searchSize = config.searchSize
    let dataStored = createValuePairFromFile()           
    let rangeFirstIndex = 8
    let rangeEndIndex = rangeFirstIndex + searchSize 

    if(typeof arraySearch == 'undefined'){
        arraySearch = []
    }

    while(true){       
        arrayStored = dataStored.slice(rangeFirstIndex,rangeEndIndex)
        if(arrayStored.length < 1){
            console.log('all stored avalues were iterated')
            break
        }else if(getMatchesTotalFromSearch(arrayStored,arraySearch) >= config.matchesRequired){
            
            if(rangeFirstIndex >= config.continuitySize){
                rangeEndIndex = rangeFirstIndex
                rangeFirstIndex = rangeFirstIndex - config.continuitySize
                let result =
                dataStored.slice(rangeFirstIndex,rangeEndIndex)
                .reverse().map(r => {
                    return `{"dh": "${r.dh}", "min": "${r.left}", "max": "${r.right}"}`.replace(new RegExp('\\.', 'g'),',')
                })
                return JSON.parse(`{ "continuidade" : [${result}]  }`)
                break;
            }
            
            console.log('matches were found between: First Index ' + rangeFirstIndex + ' - End Index ' + rangeEndIndex + '. However, it does not have continuity.')
            break
        }
        
        rangeFirstIndex++
        rangeEndIndex++
    }
}

module.exports = {
    processaConsulta
}
