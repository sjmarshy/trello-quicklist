#!/usr/bin/env node

"use strict";

const program = require("commander");
const version = require("../package.json").version;
const fs = require("fs");
const trello = require("./trello.js");

let stdInputFinished = false;
let stdInput = "";

function parseInput(input) {
    return input.split("\n");
}

function run(input) {

    let board = program.args[0] !== undefined ? program.args[0] : program.help();
    let list = program.args[1] !== undefined ? program.args[1] : program.help();

    let cardsArray = parseInput(input);

    trello.createCardsFromArray(board, list, cardsArray).then(function () {
        console.log("yo");
        process.exit();
    });
}

program
    .version(version)
    .usage("[options] <boardname> <listname>")
    .option("-i --input <list-filename>", "supply  an index file")
    .parse(process.argv);

process.stdin.setEncoding("utf8");
process.stdin.on("readable", function () {

    let chunk = process.stdin.read();

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
