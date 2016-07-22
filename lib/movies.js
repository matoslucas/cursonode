/* eslint-disable semi */
"use strict";

const fdebug = require("./fdebug");
const debug = fdebug("movies:lib:movies");
const http = require("http");

function Movies(main) {
    this.db = main.db;
    debug('init');
}

//http://www.omdbapi.com/?t=starwars&y=&plot=short&r=json



Movies.prototype.search = function(obj){
    var self = this;

    debug("search called: "+JSON.stringify(obj));

    return new Promise((resolve, rejec)=>{

        let query = {};
console.log("BUSQUEDA");
        if(obj.title) query.Title = new RegExp(obj.title, 'i');
        if(obj.year) query.Year = obj.year;
        if(obj.id) query.imdbID = obj.id;

        self.db.movies.find(query, {}, (err, docs)=>{
 
if(err){
return reject(err);
}else{
if(0 < docs.length){
console.log('retorna de la base');
return resolve(docs);
}else{
console.log('Busca en imdb');
http.get( 'http://www.omdbapi.com/?t=' + obj.title +'&y=&plot=short&r=json', (res) => {
 
// consume response body
/*res.on("data", function(chunk) {
console.log("BODY: " , chunk);
self.db.movies.insert(JSON.parse(chunk));
return resolve(JSON.parse(chunk));
})*/
var body = [];
res.on('data', function(chunk) {
 body.push(chunk);
}).on('end', function() {
body = Buffer.concat(body).toString();
let json = JSON.parse(body)
 
let queryID = {};
queryID.imdbID = json.imdbID;

self.db.movies.find(queryID, {}, (err1, docs1)=>{
if(err1){
return reject(err1);
}else{
if(docs1.length == 0){
self.db.movies.insert(json);
console.log('inserta en base');
}
}})
 
return resolve(json);
});
});
//return resolve({});
}
 
}
            //err ? reject(err) : resolve(docs);
        })
    });
}

Movies.prototype.add = function(p){
    var self = this;

    return new Promise((resolve, rejec)=>{


        self.db.movies.insert(p, (err, docs)=>{
            err ? reject(err) : resolve(docs);
        })
    });
}

module.exports = Movies;