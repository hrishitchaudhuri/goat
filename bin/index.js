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
    const errMsg = chalk.red.bold(">> [ERR] Please enter a valid argument. <<")
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

let url = 'http://localhost:8000/mapi/'


// Obtain: Searches for data by title.
if (argv.obtain && argv.t) {
    url += `search/?TITLE=${escape(argv.t)}`;

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

// Forge: Creates a new note with a new note ID. Also requires the -t and -m flags to set title and message. 
if (argv.forge && argv.t && argv.m) {
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

            axios.post(url, note, {
                headers: {
                    "Content-type" : "application/json",
                    "Access-Control-Allow-Origin" : "*"
                }
            })
                .then(response => {
                    const successMsg = chalk.green.bold(">> [INFO] FORGE successful. <<");
                    console.log(successMsg);
                });
        });
}

// Obliterate: Clear notes by ID.
if (argv.oblit) {
    url += 'delete';

    const note = {
        NOTE_ID : argv.oblit
    };

    axios.post(url, note)
        .then(res => {
            const successMsg = chalk.green.bold(">> [INFO] OBLIT successful. <<");
            console.log(successMsg);
        });
}

// Affix: Add tasks to notes by ID.
if (argv.affix && argv.m) {
    let get_url = url + `?NOTE_ID=${escape(argv.affix)}`;

    axios.get(get_url)
        .then(res => {
            let data = res.data;
            data.ITEMS.push(argv.m);

            axios.put(url + '/affix', { NOTE_ID : argv.affix, ITEMS : data.ITEMS })
                .then(res => {
                    const successMsg = chalk.green.bold(">> [INFO] AFFIX successful. <<");
                    console.log(successMsg);
                });
        });
}