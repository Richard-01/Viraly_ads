import mysqlAwait from 'mysql-await';
import stagingConfig from './staging-mysql-config.json' assert {type: "json"};

const mysqlDriverStaging = mysqlAwait.createPool(stagingConfig);

mysqlDriverStaging.on(`acquire`, (connection) => {
  console.log(`Connection %d acquired`, connection.threadId);
});

mysqlDriverStaging.on(`connection`, (connection) => {
  console.log(`Connection %d connected`, connection.threadId);
});

mysqlDriverStaging.on(`enqueue`, () => {
  console.log(`Waiting for available connection slot`);
});

mysqlDriverStaging.on(`release`, function (connection) {
  console.log(`Connection %d released`, connection.threadId);
});

export default mysqlDriverStaging;
