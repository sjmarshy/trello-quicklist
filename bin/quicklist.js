#!/usr/bin/env node


"use strict";

var program = require("commander");
var version = require("../package.json").version;
var fs = require("fs");
var trello = require("./trello.js");

var stdInputFinished = false;
var stdInput = "";

function parseInput(input) {
    return input.split("\n");
}

function run(input) {

    var board = program.args[0] !== undefined ? program.args[0] : program.help();
    var list = program.args[1] !== undefined ? program.args[1] : program.help();

    var cardsArray = parseInput(input);

    trello.createCardsFromArray(board, list, cardsArray).then(function () {
        console.log("yo");
        process.exit();
    });
}

program.version(version).usage("[options] <boardname> <listname>").option("-i --input <list-filename>", "supply  an index file").parse(process.argv);

process.stdin.setEncoding("utf8");
process.stdin.on("readable", function () {

    var chunk = process.stdin.read();

    if (chunk) {
        stdInput += chunk;
    }
});
process.stdin.on("end", function () {
    stdInputFinished = true;
});

function handleStandardInput(attempts) {

    if (!attempts) {
        attempts = 0;
    }

    if (!stdInputFinished && attempts < 100) {
        setTimeout(function () {
            handleStandardInput(attempts++);
        }, 100);
    } else if (stdInputFinished) {
        run(stdInput);
    } else {
        console.error("argument required");
    }
}

if (program.input) {
    try {
        run(fs.readFileSync(program.input));
    } catch (e) {
        throw e;
    }
} else {

    handleStandardInput();
}