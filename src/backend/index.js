const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// const redis = require('redis');
// const redisClient = redis.createClient({
// 	host: keys.redisHost,
// 	port: keys.redisPort,
// 	retry_strategy: () => 1000 
// });

const { Pool } = require('pg');
const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDatabase,
	password: keys.pgPassword,
	port: keys.pgPort
});

pgClient.on('error', () => console.log('No connection to PG DB'));

pgClient.query('CREATE TABLE IF NOT EXISTS results(number INT, prime INT)').catch(err => console.log(err));

console.log(keys);

app.get('/:number', (req, resp) => {
  const number = req.params.number;
  console.log('Received a request with number: ' + number);
  // redisClient.get(number, (err, result) => {
  //   // if the result is cached
  //   if (result) {
  //     if (result === "1"){
  //       resp.send("(cache) PRIME");
  //     }
  //     else {
  //       resp.send("(cache) NOT PRIME")
  //     }
  //   }
  //   else {
      const wynik = test_prime(number);
      // required comparison for redis
      if (wynik === 1) {
        //redisClient.set(number, 1);
        resp.send("PRIME");
      }
      else {
        //redisClient.set(number, 0);
        resp.send("NOT PRIME");
      }
      // inserting a number and 0 or 1 into a database with no other info is rather pointless
      // but it's just a way to make use of a database
      pgClient.query('INSERT INTO results(number, prime) VALUES($1 ,$2)', [number, wynik], (err, res) => {
        if (err) {
          console.log(err.stack);
        };
      })
    // };
  // });
});

app.get('/', (req, resp) => {
	resp.send('No number was given');
});

app.listen(5000, err => {
	console.log('Server listening on port 5000');
});

const test_prime = (n) => {
  if (n===1) {
    return 0;
  }
  else if(n === 2) {
    return 1;
  } 
  else {
    for(var x = 2; x < n; x++) {
      if(n % x === 0) {
        return 0;
      }
    }
    return 1;  
  }
}