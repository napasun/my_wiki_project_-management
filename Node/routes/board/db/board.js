const sql_board = require('./sql/board').sql;
const template = require('../../DBPromiseTemplate')



exports.BoardService = {
    findByAll: (data) => {
        return template.returnDataFunc(data, sql_board.findByAll);
    },
    findByIdx: (data) => {
        return template.returnOneDataFunc(data, sql_board.findByIdx);
    },
    save: (data) => {
        return template.notReturnDataFunc(data, sql_board.save);
    },
    update: (data) => {
        return template.notReturnDataFunc(data, sql_board.update);
    },
    delete: (data) => {
        return template.notReturnDataFunc(data, sql_board.delete);
    }
}