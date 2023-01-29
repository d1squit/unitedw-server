const express = require('express');
const path = require('path');
const process = require('process');
const { exec } = require('child_process');
const ejs = require('ejs');
const fs = require('fs');


const app = express();
const port = 3000 | process.env.port;


function execute_bot(command) {
    return new Promise((resolve, reject) => {
        exec('cd ./unitedw && python3 ./main.py ' + command, (err, stdout, stderr) => {
            if (err) reject(err);
            resolve(stdout);
        });
    });
}


app.get('/', async (req, res) => {
    if (req.query.password === 'Xhe_av-/da1!rksC') {
        if (!req.query.email) {
            fs.readFile(__dirname + '/index.html', async (err, html) => {
                res.send(await ejs.render(html.toString(), { users: '{ "empty": true }' }, {async: true}));
            });
        } else {
            if (req.query.type === 'post') {
                await execute_bot(`--em ${req.query.email} set main btc ${req.query.main}`);
                await execute_bot(`--em ${req.query.email} set ins btc ${req.query.ins}`);
                await execute_bot(`--em ${req.query.email} set bl btc ${req.query.bl}`);
                await execute_bot(`--em ${req.query.email} block 0 -m '${req.query.block}'`);
            }

            execute_bot(`--em ${req.query.email} --debug`).then(user => {
                fs.readFile(__dirname + '/index.html', async (err, html) => {
                    res.send(await ejs.render(html.toString(), {users: user.replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']').replace(/None/g, 'null')}, {async: true}));
                });
            });
        }
    }
});


app.listen(port, () => {});
