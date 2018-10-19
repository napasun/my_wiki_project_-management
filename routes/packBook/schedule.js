/**
 * https://www.npmjs.com/package/node-schedule
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

 */

var schedule = require('node-schedule');
 
var j = schedule.scheduleJob('0 0 1 * *', function(){
  //TODO 미리 예약된 책이 있는 지 확인
  let db = new sqlite3.Database(bookDBPath);
  db.all("SELECT * FROM bookReservation WHERE finish = true ORDER BY orderNum", [], function(err, rows) {
    //TODO 예약된 책이 있을 경우 그 책부터 없을 경우 책 목록에서 가져오기
  });
  db.close();
});



// var schedule = require('node-schedule');
// var date = new Date(2012, 11, 21, 5, 30, 0);
// var x = 'Tada!';
// var j = schedule.scheduleJob(date, function(y){
//   console.log(y);
// }.bind(null,x));
// x = 'Changing Data';
// //This will log 'Tada!' when the scheduled Job runs, rather than 'Changing Data', which x changes to immediately after scheduling.

// var rule = new schedule.RecurrenceRule();
// rule.minute = 42;
 
// var j = schedule.scheduleJob(rule, function(){
//   console.log('The answer to life, the universe, and everything!');
// });

// var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, new schedule.Range(4, 6)];
// rule.hour = 17;
// rule.minute = 0;
 
// var j = schedule.scheduleJob(rule, function(){
//   console.log('Today is recognized by Rebecca Black!');
// });
// RecurrenceRule properties

// second
// minute
// hour
// date
// month
// year
// dayOfWeek