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

        if(obj.title) query.Title = new RegExp(obj.title, "i");
        if(obj.year) query.Year = obj.year;
        if(obj.id) query.imdbID = obj.id;

        self.db.movies.find(query, {}, (err, docs)=>{
		
		if(err){
			return reject(err);
		}else{
			if(0 < docs.length){
				return resolve(docs);
			}else{
				http.get('http://www.omdbapi.com/?t=' + obj.title +'&y=&plot=short&r=json', (res) => {
				 
				 // consume response body
				 res.on("data", function(chunk) {
				 var obj=JSON.parse(chunk);
				console.log("BODY: " ,obj.imdbID );
				//self.db.movies.insert(JSON.parse(chunk));
				 self.db.movies.find(obj.imdbID, {}, (err, docs)=>{
					if(err){
						return reject(err);
					}else{
						
					}
				 }
				return resolve(obj);
				})
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