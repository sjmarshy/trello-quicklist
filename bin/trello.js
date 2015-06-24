"use strict";

var trelloConf = require("../config/config.json");
var Trello = require("node-trello");
var cache = require("./cache.js");

var publickey = trelloConf["trello-publickey"];
var userToken = trelloConf["trello-user-token"];

var t = new Trello(publickey, userToken);

function createBoard(board) {

    return new Promise(function (resolve, reject) {

        t.post("1/boards", {
            name: board
        }, function (err, data) {

            if (err) {
                reject(err);
            } else {

                var boards = cache.get("boards");

                if (boards.length > 0) {
                    boards.push(data);
                    cache.set("boards", boards);
                }

                resolve(data);
            }
        });
    });
}

function doesBoardExist(board) {

    return new Promise(function (resolve, reject) {

        t.get("1/members/me/boards", function (err, data) {

            if (err) {
                reject(err);
            }

            cache.set("boards", data);
            return resolve(data.filter(function (b) {
                return b.name === board;
            }).length >= 1);
        });
    });
}

function getBoardID(board) {

    var boards = cache.get("boards");

    if (boards.length > 0) {
        var brd = boards.filter(function (b) {
            return b.name === board;
        })[0];

        if (brd) {
            return brd.id;
        }
    }

    throw new Error();
}

function getListID(list) {

    var lists = cache.get("lists");

    if (lists.length > 0) {

        var lst = lists.filter(function (l) {
            return l.name === list;
        })[0];

        if (lst) {
            return lst.id;
        }
    }

    throw new Error();
}

function doesListExist(board, list) {

    var id = getBoardID(board);

    return new Promise(function (resolve, reject) {

        t.get("1/boards/" + id + "/lists", function (err, data) {

            if (err) {
                return reject(err);
            }

            cache.set("lists", data);

            resolve(data.filter(function (l) {
                return l.name === list;
            }).length >= 1);
        });
    });
}

function createList(board, list) {

    var id = getBoardID(board);

    return new Promise(function (resolve, reject) {

        t.post("1/boards/" + id + "/lists", {
            name: list
        }, function (err, data) {

            if (err) {
                return reject(err);
            }

            var lists = cache.get("lists");

            if (lists.length > 0) {

                lists.push(data);
                cache.set("lists", lists);
            }

            return resolve(data);
        });
    });
}

function addCardToList(list, card) {

    var id = getListID(list);

    return new Promise(function (resolve, reject) {

        t.post("1/lists/" + id + "/cards", {
            name: card,
            due: null
        }, function (err, data) {

            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}

function createCardsFromArray(board, list, cardArray) {

    return doesBoardExist(board).then(function (boardExists) {

        if (!boardExists) {
            return createBoard(board);
        } else {
            return true;
        }
    }).then(function () {

        return doesListExist(board, list);
    }).then(function (listExists) {

        if (!listExists) {
            return createList(board, list);
        } else {
            return true;
        }
    }).then(function () {

        return Promise.all(cardArray.map((function () {
            return function (card) {
                return addCardToList(list, card);
            };
        })()));
    });
}

module.exports = {
    createCardsFromArray: createCardsFromArray
};