/* import */
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const continuidade = require('./routes/continuidade')

/*config*/
const port = process.env.PORT || 3000

/*bootstrap*/
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')



app.listen(port, err => {
    if(err){
        console.log('[Error] Failed application initialization')
    }else{
        console.log('[Info] Application Up')
    }
})

app.get('/', (req, res) => res.render('index'))
app.use('/continuidade', continuidade)