const mysql = require('mysql');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({region: 'us-west-1'});
const stockQueue = 'https://sqs.us-west-1.amazonaws.com/202232912218/OutOfStock';
const newProductOut = 'https://sqs.us-west-1.amazonaws.com/202232912218/NewProductsOut';
const newProductIn = 'https://sqs.us-west-1.amazonaws.com/202232912218/NewProducts';

let connection = mysql.createConnection({
	host: process.env.SQLIP || 'localhost',
	user: 'root',
	password: process.env.PASSWORD || '',
	database: 'thesis'
})

connection.connect((err) => {
	if(err){
		throw err
	} else {
		console.log('database connected')
	}
})

var out = []

let updateInventory = function(arr) {
    let joined = arr.join(',');
    joined = joined.split('');
    joined.unshift('(');
    joined.push(')');
    joined = joined.join('')
	let queryStr = "UPDATE product_info SET quantity = quantity - 1 where id in " + joined + 'and quantity != 0'
	connection.query(queryStr, (err, res) => {
		if(err){
			throw err
		} else {
			if(res.changedRows < arr.length){
				var queryStr = 'SELECT id from product_info where id in ' + joined + 'and quantity = 0'
				connection.query(queryStr, (err, res) => {
					if(err){
						throw err
					} else {
						if(out.length + res.length > 10){
						  setTimeout(outOfStock,0)
						} else {
						  res.forEach(each => {
                            out.push({
		    	              Id: JSON.stringify(Math.floor(Math.random() * 100000)),
					    	  MessageBody: JSON.stringify(each.id)
						    })
						  })
						}  
					}
				})
			}
		}
	})
	return true 
}

let addInventory = (obj, messageProps) => {
  var values = obj.Body.split(',')
  queryStr = "INSERT INTO product_info (name, category, price, description, quantity) VALUES (?,?,?,?,?)"
  connection.query(queryStr, values,(err, data) => {
  	if(err){
  		throw err;
  	} else {
  		params = {
  			MessageBody: `${values[0]}, ${values[1]}, ${values[4]}`,
  			QueueUrl: newProductOut
  		}
  		sqs.sendMessage(params, (err, res) => {
  			if(err){
  				throw err
  			} else {
              params = {
              	ReceiptHandle: messageProps,
                QueueUrl: newProductIn
              }
              sqs.deleteMessage(params, (err) => {
              	if(err){
              		throw err
              	}
              })
  			}
  		})
  	}
  })
  return true
}

let outOfStock = () => {
  let params = {
    Entries: out,
  	QueueUrl: stockQueue
  }
  sqs.sendMessageBatch(params, (err, data) => {
  	if(err){
  		throw err
  	}
  })
  out = []
}


module.exports = {
	updateInventory,
	addInventory
}