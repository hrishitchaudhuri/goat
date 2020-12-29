#!/usr/bin/env node

const chalk=require('chalk');
const boxen=require('boxen');
const yargs=require('yargs');
const axios=require('axios');

var argv=require('yargs').argv;

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
    backgroundColor: "#555555"
};

/*
const srchOptions = yargs
    .option("get-note", { alias: "getnotebytitle", describe: "Get all tasks under a common title", type: "string" })
    .option("make-note", { alias: "makenotebytitle", describe: "Upload a note", type: "string" })
    .argv;
*/

let url = 'http://localhost:8000/mapi/'

if (argv.gt) {
    url += `search/?TITLE=${escape(argv.gt)}`;

    axios.get(url, { headers: { Accept: "application/json" }})
        .then(res => {
            if (res.data.length) {
                listString = '';

                for (let i=0; i < res.data.length; i++) {
                    for (let j=0; j < res.data[i].ITEMS.length; j++) {
                        listString += res.data[i].ITEMS[j] + '\n';
                    }
                }
                
                const successMsg = chalk.white.bold(listString);
                const msgBox = boxen(successMsg, boxenOptions);
                console.log(msgBox);
            }

            else {
                const errMsg = chalk.red.bold(">> [ERR] No tasks found with matching title. <<");
                const msgBox = boxen(errMsg, boxenOptions);
                console.log(msgBox);
            }
        });
}