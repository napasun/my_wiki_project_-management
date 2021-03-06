const query = require('./module/query');
const common = require('../common');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const bookDBPath = 'db/books.db';

console.info("PackKo Route...")

router.get('/', function(req, res, next) {
  res.render('pack/list_ko', {"menu": ['PackPub', '번역서']});
});

router.get('/list', function(req, res, next) {
  let db = new sqlite3.Database(bookDBPath);
  
  let pageNum = req.query.pageNum;
  let rowNum = req.query.rowNum;
  let startNum = (pageNum - 1) * rowNum;
  let searchText = req.query.searchText;
  
  let sql = "SELECT b.* FROM bookReservation AS bt LEFT JOIN book AS b ON b.isbn = bt.isbn WHERE bt.save > 0";
  let countSql = "SELECT count(*) AS bookCount FROM bookReservation WHERE save > 0";
  let param = [];
  let countParam = [];
  if (searchText != "") {
    searchText = "%"+searchText+"%"
    sql += " AND b.title like ?";
    param.push(searchText);
    countSql += " AND title like ?";
    countParam.push(searchText);
  }
  sql += " ORDER BY b.publicationDate desc LIMIT ?, ?"
  param.push(startNum);
  param.push(rowNum);

  db.all(sql, param, function(err, rows) {
    db.get(countSql, countParam, (err, row) => {
      res.send({"books" : rows, "bookCount" : row.bookCount});
    });  
  });	 
  db.close();
});

/**
 * read 
 */
router.get('/:isbn', function(req, res, next) {
  res.render('pack/read_ko', {"isbn" : req.params.isbn, "type" : req.query.type, "menu": ['PackPub', '번역서']})
});

router.get('/list/:isbn', function(req, res, next) {
  let db = new sqlite3.Database(bookDBPath);
  db.all("SELECT * FROM contentTranslate WHERE isbn = ? ORDER BY contentIndex", [req.params.isbn], function(err, rows) {
    res.send({"book_data" : rows})
  });
  db.close();
});

router.get('/listGoogle/:isbn', function(req, res, next) {
  let db = new sqlite3.Database(bookDBPath);
  db.all("SELECT * FROM contentGoogle WHERE isbn = ? ORDER BY contentIndex", [req.params.isbn], function(err, rows) {
    res.send({"book_data" : rows})
  });
  db.close();
});


router.put('/ContentTranslate/:isbn/:contentIndex', common.isLoggedIn, function(req, res, next) {
  let db = new sqlite3.Database(bookDBPath);
  query.selectContentTranslateByIsbnAndContentIndex(db, [req.params.isbn, req.params.contentIndex], (rows) => {
    if (rows.length != 0) {
      query.updateContentTranslate(db
        , [req.body.content, req.params.isbn, req.params.contentIndex]
        , (err) => {
          if (err == null)
            res.send({"result" : "성공"})
          else {
            res.send({"result" : err})
          }
      });
    }
  });
  db.close();
})

module.exports = router;