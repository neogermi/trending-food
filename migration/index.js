var request = require('request');
var config  = require('../config');

var fs = require('fs');
var path = require('path');
var sys = require('sys');
var fut = require('futures').sequence;
var exec = require('child_process').exec;

fs.exists(config.uploadDir, function (exists) {
    if(!exists) fs.mkdir(config.uploadDir);
});

fs.exists(config.sslDir, function (exists) {
    if(!exists) fs.mkdir(config.sslDir);
});

var seq = new fut();

fs.readdir(path.join(__dirname, '/assets/images/'), function (err, files) {

    files.forEach(function (file) {

        seq.then(function (next) {

            var req  = request.post('https://127.0.0.1:' + config.port + '/meal/add');
            var form = req.form()

            form.append('title', path.basename(file, '.jpg'));
            form.append('amount', 1);
            form.append('image', fs.createReadStream(path.join(__dirname, '/assets/images/' + path.basename(file))));

            req.on('response', function (response) {
                console.log(file + ' added.');
                next();
            });

        });
    });
});

var mealtimes = [
    { id: 'mealtime_1', title: 'A - 12:30'},
    { id: 'mealtime_2', title: 'B - 13:15'},
    { id: 'mealtime_3', title: 'C - 14:00'},
];

mealtimes.forEach(function (item) {
    request({
        uri     :  'https://127.0.0.1:' + config.port + '/mealtime/add',
        method  : 'POST',
        body    : {
            id   : item.id,
            title: item.title
        },
        json: true
    }, function () {
        console.log('Added mealtime: ' + item.id + ' ' + item.title);
    });
});
