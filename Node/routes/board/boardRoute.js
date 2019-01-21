const express = require('express');
const showdown = require('showdown') 
const converter = new showdown.Converter();
const router = express.Router();
const boardDB = require('./db/board');
const boardContentDB = require('./db/boardContent');


console.info("Board Route...");

router.get("/", (req, res) => {
    res.render("board/board/list", {menu : ["게시판", "게시판 목록"]})
});

router.get("/content", (req, res) => {
    res.render('board/content/list', {menu: ['게시판', '목록'] })  
});

router.get("/content/read/:idx", (req, res) => {
    let idx = req.params.idx;

    boardContentDB.findByIdx([idx], (err, row) => {
        row.content = converter.makeHtml(row.content);
        res.render('board/content/read', {menu: ['게시판', '내용',], "row" : row }) 
    });
     
});

router.route("/content/form")
.get((req, res) => {
    let idx = req.query.idx;

    if (idx == undefined) {
        idx = 0;
        res.render('board/content/form', {menu: ['게시판', '편집'], idx: idx , row: null})
    } else {
        boardContentDB.findByIdx(idx, (err, row) => {
            res.render('board/content/form', {menu: ['게시판', '편집'], idx: idx, row: row })
        });
    } 
}).post((req, res) => { 
    boardContentDB.save([1, req.body.title, req.body.content/*, Date()*/, 0]
    , (err, lastId) => {
        res.send({"result" : err, "idx" : lastId});
    });
}).put((req, res) => {
    boardContentDB.update([req.body.title, req.body.content, req.body.idx]
        , (err) => {
        res.send({"result" : err, "idx" : req.body.idx});
    });
}).delete((req, res) => {
    let idx = req.body.idx;

    boardContentDB.delete(idx, (err) => {
        res.send({"result" : err});
    })
});

function undefinedCheck(data, def) {
    if (data == undefined)
        return def;
    else
        return data;
}

router.get("/content/list", (req, res) => {
    let boardIdx = req.query.boardIdx;
    let start = req.query.start;
    let rows = req.query.rows;

    boardIdx = undefinedCheck(boardIdx, "1");
    start = undefinedCheck(start, "0");
    rows = undefinedCheck(rows, "10");
    
    boardContentDB.findbyBoardIdx([boardIdx, start, rows]
        , (err, rows) => {
        if (err) {
            console.log(err);
        }

        res.send({"list" : rows});
    });
});

router.get("/content/:idx", (req, res) => {
    let idx = req.query.idx;

    boardContentDB.findByIdx([idx], (row) => {
        res.send({"row" : row});
    });
});

module.exports = router;