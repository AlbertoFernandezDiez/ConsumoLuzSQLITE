//Creamos la BD
var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('fridge'),
Fridge = {};

Fridge.createTables = function(){
		db.run("CREATE TABLE IF NOT EXISTS  users (id INTEGER PRIMARY KEY  NOT NULL ,name VARCHAR NOT NULL ,password VARCHAR NOT NULL)");
		console.log("Users table created");
		
		db.run("CREATE  TABLE IF NOT EXISTS drawer (userid INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE  , drawer INTEGER NOT NULL , PRIMARY KEY (userid, drawer))")
		console.log("Drawer table created");

		db.run("CREATE  TABLE IF NOT EXISTS content (userid INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE , drawer INTEGER NOT NULL REFERENCES drawer(drawer) ON DELETE CASCADE , product VARCHAR NOT NULL , quantity INTEGER NOT NULL , PRIMARY KEY (userid, drawer,product))")
		console.log("Content table created");

}

Fridge.login = function(request, response){
	var data = request.body;
	
	stmt = db.prepare("SELECT * FROM users WHERE name = ? and password = ?");
	
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

Fridge.singin = function(request, response){
	var data = request.body;
	
	
	stmt = db.prepare("SELECT * FROM users WHERE name = ? and password = ?");
	
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
					stmt = db.prepare("INSERT INTO users (name,password) VALUES (?,?)");
	
					stmt.bind(data.name, data.password);
					
					stmt.run(function(error,result){
					if(error) 
					{
                     throw err;
					} 
					else 
					{
						//finalresult = true;
						console.log("User added");
						insertDrawers(response, data)
					}
					});
			}
		}
	});
	

};
	
	
Fridge.listItems = function(request, response){
	
	var data = request.body;
	
	
	stmt = db.prepare("select drawer, product, quantity from users inner join content on users.id = content.userid and users.name = ? and users.password=? ");
	
	stmt.bind(data.name, data.password);

		stmt.all(function(error, row){
		if(error){
			throw error
		}
		else{
			if (row)
			{
				response.send(row);
			}
			else
			{
				response.send('{}')
			}
		}
	});
	
	
}

Fridge.listDrawers = function(request, response){
	
	var data = request.body;
	
	
	stmt = db.prepare("select drawer.drawer from users inner join drawer on users.id = drawer.userid and users.name = ? and users.password=? ");
	
	stmt.bind(data.name, data.password);

		stmt.all(function(error, row){
		if(error){
			throw error
		}
		else{
			if (row)
			{
				console.log(row);
				response.send(row);
			}
			else
			{
				response.send('{}')
			}
		}
	});
	
	
}

	function insertDrawers(response, data){

	var drawers = (data.drawers) ? data.drawers : 0;
	var id = 0;

	stmt = db.prepare("SELECT * FROM users WHERE name = ? and password = ?");
	
	stmt.bind(data.name, data.password);
		stmt.get(function(error, row){
			if(error){
				throw error
			}
			else{
				if (row)
				{
					console.log("Row is ")
					console.log(row)
					id = row.id;
					console.log("El id es " + id + "y el numero de cajones " + drawers);
					
					if (id != 0)
					{
		console.log("Entra en el if");
						for (var x = 0; x < drawers; x++){
							console.log("I'm inserting the value " + x);
							stmt = db.prepare("INSERT INTO drawer (userid,drawer) VALUES (?,?)");
			
							stmt.bind(row.id, x + 1);
							
							stmt.run(function(error,result){
							if(error) 
							{
							 throw err;
							} 
							else 
							{
								console.log("Drawer added" );
							}
							});
							
						}
					response.send(true);
					}
				}
			}
		})
	}
	
	
Fridge.newProduct = function(request, response){
	var data = request.body;
	console.log(data);
	
	//{"name":"Alberto","password":"Alberto","drawer":1,"product":"asfd","quantity":5}
	
	stmt = db.prepare("SELECT * FROM users WHERE name = ? and password = ?");
	
	stmt.bind(data.name, data.password);

		stmt.get(function(error, row){
		if(error){
			throw error
		}
		else{
			if (row)
			{
				addProduct(row.id, data.drawer,data.product, data.quantity, response)				
			}
			else
			{
				response.send(false);
			}
		}
	});
};

function addProduct(id, drawer, product, quantity, response){

id = parseInt(id);
drawer = parseInt(drawer);
quantity = parseInt(quantity);

	if (id.toString() == "NaN" || drawer.toString() == "NaN" || quantity.toString() == "NaN"){
			response.send(false);
	}
	else{
		stmt = db.prepare("INSERT INTO content (userid,drawer,product,quantity) VALUES (?,?,?,?)");
		
		stmt.bind(id,drawer,product,quantity);
		stmt.run(function(error,result){
							if(error) 
							{
							 throw error;
							} 
							else 
							{
								console.log("Product added" );
								response.send(true);
							}
							});
	}
}

Fridge.deleteProduct = function(request, response){
	var data = request.body;
	console.log(data);
	
	//{"name":"Alberto","password":"Alberto","drawer":1,"product":"asfd","quantity":5}
	
	stmt = db.prepare("SELECT * FROM users WHERE name = ? and password = ?");
	
	stmt.bind(data.name, data.password);

		stmt.get(function(error, row){
		if(error){
			throw error
		}
		else{
			if (row)
			{
				deleteProduct(row.id, data.drawer,data.product, response)				
			}
			else
			{
				response.send(false);
			}
		}
	});
};

function deleteProduct(id, drawer, product, response){

id = parseInt(id);
drawer = parseInt(drawer);

	if (id.toString() == "NaN" || drawer.toString() == "NaN" ){
			response.send(false);
	}
	else{
		stmt = db.prepare("DELETE FROM content WHERE userid = ? AND drawer = ? AND product = ?");
		
		stmt.bind(id,drawer,product);
		stmt.run(function(error,result){
							if(error) 
							{
							 throw error;
							} 
							else 
							{
								console.log("Product deleted" );
								response.send(true);
							}
							});
	}
}

module.exports = Fridge;