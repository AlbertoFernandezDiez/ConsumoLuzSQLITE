var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.all('*', function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	 });

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'www')));

var conexionBD = require('./models/conexionBD.js')

var router=express.Router();
app.use(router);

conexionBD.createTables();

router.route('/add')
.post(conexionBD.addConsumption);

router.route('/listar')
.post(conexionBD.viewAll);

router.route('/singin')
.post(conexionBD.singin);

router.route('/login')
.post(conexionBD.login);

router.route('/listarAno')
.post(conexionBD.listYears)


router.route('/getAnos')
.post(conexionBD.listYearsData)


app.listen(process.argv[2])