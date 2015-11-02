//Creamos la BD
var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('Consumption.sqlite'),
Consumption = {};

Consumption.createTables = function(){
		db.run("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY  NOT NULL   ,name VARCHAR NOT NULL ,password VARCHAR NOT NULL );");
		console.log("Users table created");
		
		db.run("CREATE  TABLE IF NOT EXISTS consumption (userid INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE  , consumption INTEGER NOT NULL, price INTEGER NOT NULL DEFAULT (0), endingdate DATE NOT NULL, year INTEGER NOT NULL , PRIMARY KEY (userid, endingdate))")
		console.log("Comsumption table created");

	

};

Consumption.login = function(request, response){
	var data = request.body;
	
	stmt = db.prepare("SELECT * FROM user WHERE name = ? and password = ?");
	
	stmt.bind(data.name, data.password);
	
	stmt.get(function(error, row){
		if(error){
			throw error
		}
		else{
			if (row)
			{
				response.send(true);
			}
			else
			{
				response.send(false);
			}
		}
	});
}

Consumption.singin = function(request, response){
	var data = request.body;
	
	
	stmt = db.prepare("SELECT * FROM user WHERE name = ? and password = ?");
	
	stmt.bind(data.name, data.password);

		stmt.get(function(error, row){
		if(error){
			throw error
		}
		else{
			if (row)
			{
				response.send(false);
			}
			else
			{
					stmt = db.prepare("INSERT INTO user (name,password) VALUES (?,?)");
	
					stmt.bind(data.name, data.password);
					
					stmt.run(function(error,result){
					if(error) 
					{
                     throw err;
					} 
					else 
					{
						response.send(true);
					}
					});
			}
		}
	});
};
	
Consumption.addConsumption = function(request,response){
	var data = request.body;
	
	
	stmt = db.prepare("SELECT * FROM user WHERE name = ? and password = ?");
	
	stmt.bind(data.name, data.password);

		stmt.get(function(error, row){
		if(error){
			throw error;
		}
		else{
			if (row)
			{
				var year = new Date(data.fechafin).getFullYear();
				stmt = db.prepare("INSERT INTO consumption (userid,consumption,price,endingdate,year) VALUES (?,?,?,?,?)");
					stmt.bind(row.id, data.consumo, data.precio, data.fechafin,year);
					
					stmt.run(function(error,result){
							if(error) 
							{
							 throw error;
							} 
							else 
							{
								console.log("Compsumption added" );
								response.send(true);
							}
							});
					
			}
			else
			{
				response.send(false);
			}
		}
	});
};
	
Consumption.viewAll = function(request, response){
		var data = request.body;
	console.log('viewAll');
	
	stmt = db.prepare("select consumption.* from user, consumption where user.id = consumption.userid and user.name = ? and password = ?");
	
	stmt.bind(data.name, data.password);

		stmt.all(function(error, row){
		if(error){
			throw error;
		}
		else{
			if (row)
			{
				console.log(row)
				response.send(row);
			}
			else
			{
				response.send(false);
			}
		}
	});
};
	
Consumption.listYears = function(request, response){
	var data = request.body;
	
	stmt = db.prepare("SELECT distinct year  FROM consumption, user where user.name=? and user.password=?");
	
	stmt.bind(data.name, data.password);

		stmt.all(function(error, row){
		if(error){
			throw error;
		}
		else{
			if (row)
			{
				console.log(row)
				response.send(row);
			}
			else
			{
				response.send(false);
			}
		}
	});
};
	
Consumption.listYearsData = function(request, response){
	var data = request.body;
	
	stmt = db.prepare("SELECT consumption.*  FROM consumption, user where user.name=? and user.password=? and year=? order by endingdate asc");
	
	stmt.bind(data.name, data.password, data.year);

		stmt.all(function(error, row){
		if(error){
			throw error;
		}
		else{
			if (row)
			{
				console.log(row)
				response.send(row);
			}
			else
			{
				response.send(false);
			}
		}
	});
};
	
module.exports  = Consumption;