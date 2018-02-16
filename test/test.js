const expect = require('chai').expect;
const mysql = require('mysql');
const chai = require('chai');
const db = require('../Database/database.js');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({region: 'us-west-1'});
const testQueue = 'https://sqs.us-west-1.amazonaws.com/202232912218/TestQueue';
const AWSfunc = require('../AWS/updatePoll.js');
const productTestQueue = 'https://sqs.us-west-1.amazonaws.com/202232912218/testProduct';

let connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'thesis'
})

connection.connect((err) => {
	if(err){
		throw err
	} else {
		console.log('database connected')
	}
})

describe('Update Function', () => {
	describe('invoking update with', () => {
	    it('array should equal true ', async () => {
		  let update = await db.updateInventory([1,2,3,4])
          expect(update).to.equal(true)
		})
	})
})

describe('AWS deleteMessages function', () => {
	describe('', () =>{
		it('should delete all messages passed into function', async () => {
			let params = {
			  MessageBody: 'Hello',
			  QueueUrl: testQueue
			}
			let messageInfo = []
			await sqs.sendMessage(params, (err, res) => {
			})
			params = {
				QueueUrl: testQueue,
				MaxNumberOfMessages: 1, 
				VisibilityTimeout: 30
	        }
            await sqs.receiveMessage(params, (err, data) => {
              data.Messages.forEach((each) => {
              	messageInfo.push(({ 
	        		ReceiptHandle: each.ReceiptHandle,
	        		Id: each.MessageId
	        	}))
              })
            })
            AWSfunc.deleteMessages(messageInfo, testQueue)
            sqs.receiveMessage(params, (err, data) => {
            	expect(data.Messages.length).to.equal(0)
            })
		})
	})
})

describe('Add product', () => {
	describe('The checkProduct function ', () => {
	      it('should grab from queue and add product to database', async () => {
			
		})
	})
})