const AWS = require('aws-sdk');
const sqs = new AWS.SQS({region: 'us-west-1'});
const updateQueue = 'https://sqs.us-west-1.amazonaws.com/202232912218/UpdatedQuantity';
const newProducts = 'https://sqs.us-west-1.amazonaws.com/202232912218/NewProducts';
const db = require('../Database/database.js');
let params;
let elapsed = new Date().getTime();

let poll = () => {
	var index, receipts
	params = {
		QueueUrl: updateQueue,
		MaxNumberOfMessages: 10,
		VisibilityTimeout:10,
		WaitTimeSeconds: 5
	}
	sqs.receiveMessage(params, (err, data) => {
	    if (err) {
		throw err
	    } else {
		index = []
		receipts = []
		if(data.Messages){
		    data.Messages.forEach((each) => {
		    index.push(each.Body)
		    receipts.push({ 
		        ReceiptHandle: each.ReceiptHandle,
			Id: each.MessageId
		    })
		})
	    }
	    if(index.length){
                db.updateInventory(index)
	    }
	    if(receipts.length){
                deleteMessages(receipts, updateQueue)
	    }
	    setTimeout(poll, 0)
        }
    })
}

let checkProducts = (url) => {
	params = {
		QueueUrl: url || newProducts,
		MaxNumberOfMessages: 1, 
		VisibilityTimeout: 30
	}
	sqs.receiveMessage(params, (err, data) => {
		if(data.Messages && data.Messages.length > 0){
        		db.addInventory(data.Messages[0], data.Messages[0].ReceiptHandle)
      	 	}
	})
}

let deleteMessages = (messages, url) => {
	params = {
		Entries: messages,
		QueueUrl: url
	}
	sqs.deleteMessageBatch(params, (err) => {
		if(err){
			throw err
		}
	})
}



module.exports = {
    poll, 
    deleteMessages,
    checkProducts
  }

