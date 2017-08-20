var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
var request=require('request');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

function sortBy(obj,order){
    if(order === 'asc'){
        obj.sort((a,b)=> a.jobtitle.localeCompare(b.jobtitle));
    }
    if(order === 'des'){
        obj.sort((a,b)=> b.jobtitle.localeCompare(a.jobtitle));
    }
    return obj;
}

function filterResults(data, str) {
var results = [];
    console.log(str);
if (str === 'womenEarnMore') {
    data.forEach(function (elem) {
        if (parseFloat(elem.female_avg_hrly_rate) > parseFloat(elem.male_avg_hrly_rate)) {
            results.push(elem);
        }
    });
}
if (str === 'menEarnMore') {
    data.forEach(function (elem) {
        if (parseFloat(elem.female_avg_hrly_rate) < parseFloat(elem.male_avg_hrly_rate)) {
            results.push(elem);
        }
    });
}
if (str === 'wageGap1') {
    data.forEach(function (elem) {
        var diff = parseFloat(elem.female_avg_hrly_rate) - parseFloat(elem.male_avg_hrly_rate).toFixed(2);
        if (diff > .50) {
            results.push(elem);
        }
    });
}
if (str === 'equal') {
    data.forEach(function (elem) {
        var diff = parseFloat(elem.female_avg_hrly_rate) - parseFloat(elem.male_avg_hrly_rate).toFixed(2);
        if (diff === 0) {
            results.push(elem);
        }
    });


}
if(str === 'clear'){
    console.log("in clear");
    results = data;
}
return  results;
}
    app.get('/wages', function(req, res){
        var count = req.query.count;
        var start = req.query.start;
        if(start === undefined){
            start = 0;
        }
        count = Number(count)+Number(start);
        let sortCol = req.query.sortBy;
        let sOrder = req.query.sortOrder;
        var filter = req.query.filter;

        request.get('https://data.seattle.gov/resource/5m8y-83zb.json', function (error, response, body) {
            if(response && response.statusCode){
                 data = body;
                var sData;
                var r = JSON.parse(data);
                if(sortCol != undefined){
                    if( sOrder === undefined){
                        sOrder = 'asc';
                    }
                    r = sortBy(r,sOrder);
                }

                if(filter != "" && filter != undefined){
                    r = filterResults(r, filter);
                }

                var len = r.length;
                if(Array.isArray(r)){
                    sData = r.slice(start,count);
                }
                 res.send({data:sData, size:len});
            }
        });
    });

app.listen(port);
console.log('todo list RESTful API server started on: ' + port);
