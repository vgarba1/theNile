let mysql = require('mysql')
let connection = mysql.createConnection({
	host: process.env.SQLIP || 'localhost',
	user: 'root',
	password: process.env.PASSWORD || ''
})

connection.connect((err) => {
	if(err){
	  throw err
	} else {
	  console.log('database seeding')
	}
})

connection.query('CREATE DATABASE thesis', (err => {
	if(err){
		console.log('database exists')
	} else {
		connection.end()

		connection = mysql.createConnection({
			host: process.env.SQLIP || 'localhost',
			user: 'root',
			password: process.env.PASSWORD || '',
			database: 'thesis'
		})

		connection.connect((err) => {
			if(err){
			  throw err
			} else {
			  console.log('database seeding')
			}
		})


		connection.query('CREATE TABLE `product_info` (`id` INTEGER NOT NULL AUTO_INCREMENT, `name` VARCHAR(75) NOT NULL, `category` VARCHAR(50), `price` INTEGER NOT NULL,   `description` VARCHAR(255),   `quantity` INTEGER NOT NULL,   PRIMARY KEY (`id`));')

		connection.end()
    }
}))
