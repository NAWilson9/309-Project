
//Link dependencies
let config = require('./board_connector_config.json');
const router = require('express').Router();
const fs = require('fs');
const path = require('path');


//Routing

/*
Post request to api/boards
Takes a board id to update
*/
router.post('api/boards', function (req, res){
	let id = req.query.id;
	
	if(!id){
		res.statusCode = 404;
		res.send("No id or creator specified!");
		return;
	}
	
	let board = config.boards.find((board) => board.id === id);
	
	if(board){
		config.boards[config.boards.indexOf(board)] = req.body;
		fs.writepath(path.join(__dirname, 'board_connector_config.json'), JSON.stringify(config, null, 4), function(err){
			if(err){
				res.statusCode = 500;
				res.send('Error while saving board data');
				console.error(new Date().toLocaleTimeString() + ' : Unable to save board data');
				console.error(err);
			}
			else{
				res.send(board);
				return;
			}
		});
	}
	
	else{
		config.boards[config.boards.length] = req.body;
		fs.writepath(path.join(__dirname, 'board_connector_config.json'), JSON.stringify(config, null, 4), function(err){
			if(err){
				res.statusCode = 500;
				res.send('Error while saving board data');
				console.error(new Date().toLocaleTimeString() + ' : Unable to save board data');
				console.error(err);
			}	
			else{
				res.send(board);
			}
			
		});
	}
});
/*
Get requests to api/boards
Takes an id of a board or creator to get
*/
router.get('/api/boards', function(req, res){
	
	let id = req.query.id;
	
	if(id){
		id = id.split(',');
	}
	
	let creator = req.query.creator;
	
	if(!id && !creator){
		res.statusCode = 404;
		res.send("No id or creator specified!");
		return;
	}
	
	let returnBoards = [];
	
	if(creator){
		
        config.boards.forEach(function (board) {
            if(board.creator==creator){
                returnBoards.push(board);
            }
        });
		
        if(returnBoards.length === 0){
            res.statusCode = 404;
            res.send("Creator not found!")
            return;
        }
		
        res.send(returnBoards);
    }
	
	if(id){
		config.boards.forEach(function (board){
			for(var i = 0; i < id.length; i++){
				if(piece.id == id[i]){
					returnBoards.push(board);
				}
			}
		});
		
		if(returnBoards.length === 0){
			res.statusCode = 404;
			res.send("No board id/s found");
		}
		
		res.send(returnBoards);
	}			
});

module.exports = router;