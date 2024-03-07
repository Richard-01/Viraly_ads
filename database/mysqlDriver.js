import mysqlAwait from 'mysql-await';
import prodConfig from './prod-mysql-config.json' assert {type: "json"};

const mysqlDriver = mysqlAwait.createPool(prodConfig);

mysqlDriver.on(`acquire`, (connection) => {
  console.log(`Connection %d acquired`, connection.threadId);
});

mysqlDriver.on(`connection`, (connection) => {
  console.log(`Connection %d connected`, connection.threadId);
});

mysqlDriver.on(`enqueue`, () => {
  console.log(`Waiting for available connection slot`);
});

mysqlDriver.on(`release`, function (connection) {
  console.log(`Connection %d released`, connection.threadId);
});

export default mysqlDriver;
