#!/usr/bin/env node

const chalk=require('chalk');
const boxen=require('boxen');
const yargs=require('yargs');
const axios=require('axios');

var argv=require('yargs').argv;

var cnt = 0;
for (let e in argv) {
    cnt++;
}

if (cnt == 2) {
    const errMsg = chalk.red.bold("[ERR] Please enter a valid argument.")
    console.log(errMsg);
    process.exit(1);
}

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
    align: "center",
    backgroundColor: "green"
};

/*
const srchOptions = yargs
    .option("get-note", { alias: "getnotebytitle", describe: "Get all tasks under a common title", type: "string" })
    .option("make-note", { alias: "makenotebytitle", describe: "Upload a note", type: "string" })
    .argv;
*/

let url = 'http://localhost:8000/mapi/'


// Obtain: Searches for data by title.
if (argv.obtain) {
    url += `search/?TITLE=${escape(argv.gt)}`;

    axios.get(url, { headers: { Accept: "application/json" }})
        .then(res => {
            if (res.data.length) {
                let listString = '';

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
                console.log(errMsg);
            }
        });
}

// Recite: Lists all available notes. 
if (argv.recite) {
    url += 'all';

    axios.get(url, { headers: { Accept: "application/json" }})
        .then(res => {
            for (let i=0; i < res.data.length; i++) {
                let titleString = res.data[i].NOTE_ID + '. TITLE: ' + res.data[i].TITLE + '\n\n';

                let listString = '';
                for (let j=0; j < res.data[i].ITEMS.length; j++) {
                    listString += '>> ' + res.data[i].ITEMS[j] + '\n';
                }

                const titleMsg = chalk.black.underline.bold.bgWhite(titleString);
                const successMsg = chalk.white.italic.dim(listString);
                const msgBox = boxen(titleMsg + successMsg, boxenOptions);
                console.log(msgBox);
            }

            if (!res.data) {
                const errMsg = chalk.red.bold(">> [ERR] No tasks have been stored yet. <<")
                console.log(errMsg);
            }
        });
}

// Concoct: Creates a new note with a new note ID. Also requires the -t and -m flags to set title and message. 
if (argv.concoct && argv.t && argv.m) {
    var stats_url = url + 'stats';

    axios.get(stats_url)
        .then(res => {
            var note_id = res.data.count;
            var note_items = [];

            note_items.push(argv.m);

            var note = {
                NOTE_ID: note_id,
                ITEMS: note_items,
                TITLE: argv.t
            }

            axios.post(url, note);
        });

}

// Obliterate: Clear notes by ID.
if (argv.obliterate) {

}

// Affix: Add tasks to notes by ID.
if (argv.affix) {

}

// Decimate: Delete all notes by title.
if (argv.decimate) {

}

// Pulverize: Clear all notes (restart session).
if (argv.pulverize) {

}