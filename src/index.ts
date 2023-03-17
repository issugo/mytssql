#! /usr/bin/env node

// global dependencies
import path from "path";
import fs from "fs";
const figlet = require("figlet")
const { Command } = require("commander")


// custom dependencies
import { createbdd } from "./services/createbdd";
import { showbdd } from "./services/showbdd";
import { createTable } from "./services/createtable";
import { showTables } from "./services/showtables";
import { describe } from "./services/describe";
import { insertTable } from "./services/inserttable";
import { selecttable } from "./services/selecttable";

// create custom prompt for future use
let customPrompt = require('prompt-sync')({
    history: require('prompt-sync-history')() //open history file
});

const envfile = path.join(__dirname, '..', `.env`);
// check if bddFile exists and create it if not
if (!fs.existsSync(envfile)) {
    console.log("no user found");
    const username = customPrompt("Enter your username: ")
    const password = customPrompt("Enter your password: ")
    fs.writeFileSync(envfile, `BDD_USER=${username}\n\rBDD_PASSWORD=${password}`);
}

require('dotenv').config()
const BDD_USER = process.env.BDD_USER
const BDD_PASSWORD = process.env.BDD_PASSWORD

// check if data folder exists and create it if not
const dataFolder = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataFolder)) {
    console.log("test")
    fs.mkdirSync(dataFolder);
}

// print a good ascii art with the app name
console.log(figlet.textSync("My TS SQL"));

// define commander program
const program = new Command()
program
    .version("1.0.0")
    .description("A CLI to manage databases")
    .option("-l, --login", "test login")
    .option("-u, --user <value>", "enter the username to use")
    .option("-p, --password <value>", "enter the password of the user to use")
    .option("-s, --sql <value>", "enter the sql command to execute")
    .option("-f, --format <value>", "enter the format of the result (json, csv, table)")
    .parse(process.argv)

// get back options
const options = program.opts();

// check if user is logged in
if (options.user === undefined || options.password === undefined) {
    console.log("You should login to use this app")
    process.exit()
}

// check if user is logged in
if (options.user !== BDD_USER || options.password !== BDD_PASSWORD) {
    console.log("Wrong username or password")
    process.exit()
}

if (options.login == true) {
    if (options.user === BDD_USER && options.password === BDD_PASSWORD) {
        console.log("You are logged in")
    } else {
        console.log("Wrong username or password")
    }
    process.exit()
}

if (options.sql !== undefined) {
    const tempCommand = options.sql.split(" ")
    console.log("You entered a sql command")
    switch (tempCommand[0].toLowerCase()) {
        case "showbdd":
            showbdd()
            break
        case "createbdd":
            if (tempCommand[1] === undefined) {
                console.log("You should provide a name for your database")
                break
            }
            createbdd(tempCommand[1])
            break
        case "createtable":
            if (tempCommand[1] === undefined) {
                console.log("You should provide a name for your database")
                break
            }
            if (tempCommand[2] === undefined) {
                console.log("You should provide a name for your table")
                break
            }
            if (tempCommand[3] === undefined) {
                console.log("You should provide at least one column name")
                break
            }
            let columns: Array<string> = []
            for (let i = 3; i < tempCommand.length; i++) {
                columns.push(tempCommand[i])
            }
            createTable(tempCommand[1], tempCommand[2], columns)
            break
        case "showtables":
            if (tempCommand[1] === undefined) {
                console.log("You should provide a name for your database")
                break
            }
            showTables(tempCommand[1])
            break
        case "describe":
            if (tempCommand[1] === undefined) {
                console.log("You should choose a database")
                break
            }
            if (tempCommand[2] === undefined) {
                console.log("You should choose a table to describe")
                break
            }
            describe(tempCommand[1], tempCommand[2])
            break
        case "helper":
            program.outputHelp()
            break
        case "exit":
            console.log("Bye !!")
            break
        default:
            console.log("Command not found")
            console.log("You can exit by typing 'exit'")
            break
    }
    process.exit()
}

// create a loop to get commands
let command: string = ""
let commandParsed: Array<string> = [""]
let dbSelected: string = "no db selected"

while(commandParsed[0] !== "exit") {
    command = customPrompt(`Enter a command <[${dbSelected}]>: `)
    console.log("You entered: " + command)
    commandParsed = command.split(" ")
    switch (commandParsed[0].toLowerCase()) {
        case "showbdd":
            showbdd()
            break
        case "createbdd":
            if (commandParsed[1] === undefined) {
                console.log("You should provide a name for your database")
                break
            }
            createbdd(commandParsed[1])
            break
        case "selectdb":
            if (commandParsed[1] === undefined) {
                console.log("You should choose a database to select")
                break
            }
            dbSelected = commandParsed[1]
            break
        case "createtable":
            if (commandParsed[1] === undefined) {
                console.log("You should provide a name for your table")
                break
            }
            if (commandParsed[2] === undefined) {
                console.log("You should provide at least one column name")
                break
            }
            if(dbSelected === "no db selected") {
                console.log("You must select a database first")
                break
            }
            let columns: Array<string> = []
            for (let i = 2; i < commandParsed.length; i++) {
                columns.push(commandParsed[i])
            }
            createTable(dbSelected, commandParsed[1], columns)
            break
        case "showtables":
            if(dbSelected === "no db selected") {
                console.log("You must select a database first")
                break
            }
            showTables(dbSelected)
            break
        case "inserttable":
            if (commandParsed[1] === undefined) {
                console.log("You should choose a table to insert")
                break
            }
            let data: Array<string> = []
            for (let i = 2; i < commandParsed.length; i++) {
                data.push(commandParsed[i])
            }
            insertTable(dbSelected, commandParsed[1], data)
            break
        case "selecttable":
            if (commandParsed[1] === undefined) {
                console.log("You should choose a table to select")
                break
            }
            selecttable(dbSelected, commandParsed[1])
            break
        case "describe":
            if(dbSelected === "no db selected") {
                console.log("You must select a database first")
                break
            }
            if (commandParsed[1] === undefined) {
                console.log("You should choose a table to describe")
                break
            }
            describe(dbSelected, commandParsed[1])
            break
        case "helper":
            program.outputHelp()
            break
        case "exit":
            console.log("Bye !!")
            break
        default:
            console.log("Command not found")
            console.log("You can exit by typing 'exit'")
            break
    }
}