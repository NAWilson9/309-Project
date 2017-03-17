/**
 * CHSS Database Access Module
 * @module dbConnector
 */

//Link dependencies
const mongodb = require('mongodb');
const Joi = require('joi');
const ObjectID = mongodb.ObjectID;

let db;

/**
 * Database collection names
 * @private
 */
const dbCollNames = {
    user: 'users',
    piece: 'pieces',
    gameboard: 'gameboards',
    gamestate: 'gamestates',
};

/**
 * Item Schemas for Joi input validation
 * See docs at https://github.com/hapijs/joi/blob/master/API.md
 * Database items must have these formats
 * Whenever standard format changes in development, these must be updated
 * Note: piece.abilities for now is any object, but its internal schema will be defined at a later time
 * @private
 */
const dbSchemas = {
    user: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
        rating: Joi.number().integer().required(),
        wins: Joi.number().integer().required(),
        losses: Joi.number().integer().required(),
        draws: Joi.number().integer().required(),
        friends: Joi.array().items(
            Joi.string()
        ).required(),
        _id: Joi.string().optional(),
    }),
    piece: Joi.object().keys({
        name: Joi.string().required(),
        userID: Joi.string().required(),
        abilities: Joi.object().required(),
        _id: Joi.string().optional(),
    }),
    gameboard: Joi.object().keys({
        name: Joi.string().required(),
        userID: Joi.string().required(),
        _id: Joi.string().optional(),
    }),
    gamestate: Joi.object().keys({
        players: Joi.array().items(
            Joi.string()
        ).required(),
        winner: Joi.string().required(),
        board: Joi.array().items(
            Joi.array().items(
                Joi.object()
            )
        ).required(),
        _id: Joi.string().optional(),
    }),
};

/**
 * Global validation function
 * @private
 * @param {object} item Item to validate
 * @param {object} itemSchema Schema to validate against
 * @return {object} Joi.validate() result
 */
const validate = (item, itemSchema) => {
    return Joi.validate(item, itemSchema, {
        // Will not cast types (e.g. string => number)
        convert: false,
    });
};

/**
 * Helper Function for response to API user
 * Calls callback function with error and response if callback provided
 * @private
 * @param {function} callback
 * @param err
 * @param res
 */
const dbRespond = (callback, err, res) => {
    if (callback) {
        callback(err, res);
    }
};

/**
 * Error messages
 * @private
 */
const dbErrMsg = {
    noEntryData: 'No entry data specified',
    noQueryData: 'No query data specified',
    improperEntryFormat: 'Improper entry format - ',
    improperIDFormat: 'Improper ID format',
    noID: 'Must specify item ID',
    collCreation: 'Error creating collection:',
    collList: 'Error listing collections:',
    connect: 'Failure connecting to database',
};

/**
 * Adds a given valid item to given collection
 * @private
 * @param {object} item Object to insert into database
 * @param {object} itemSchema Schema to use in item format validation
 * @param {string} collectionName Collection that contains item
 * @param {function} callback Called with error or result upon Promise return from database operation
 * @res Item inserted into database or undefined if error
 * @err No entry data specified, Improper entry format + validation error, Database error, or Undefined if no error
 */
const createItem = (item, itemSchema, collectionName, callback) => {
    const validation = validate(item, itemSchema);
    if (!item) dbRespond(callback, dbErrMsg.noEntryData);
    else if (validation.error) dbRespond(callback, dbErrMsg.improperEntryFormat + validation.error);
    else
    {
        let coll = db.collection(collectionName);
        coll.insertOne(item)
            .then(
                (res) => dbRespond(callback, undefined, res.ops[0]),
                (err) => dbRespond(callback, err)
            );
    }
};

/**
 * Retrieves a item with the given key value pair from database
 * @private
 * @param {object} keyValuePair
 * Key value pair by which to search for item to retrieve from database
 * For definition check, must also contain 'value' property with value equivalent to surrounding function's caller's query value
 * 'value' property is deleted after check if value is defined
 * @param {string} collectionName Collection that contains item
 * @param {function} callback Called with error or result upon Promise return from database operation
 * @res Item if found, null if not, undefined if error
 * @err Database error, Improper ID format, or Undefined if no error
 */
const getItemByKeyValue = (keyValuePair, collectionName, callback) => {
    if (keyValuePair.value)
    {
        delete keyValuePair.value;
        if (keyValuePair.hasOwnProperty(IDKey)) {
            if (ObjectID.isValid(keyValuePair[IDKey])) keyValuePair[IDKey] = ObjectID(keyValuePair[IDKey]);
            else {
                dbRespond(callback, dbErrMsg.improperIDFormat);
                return;
            }
        }
        let coll = db.collection(collectionName);
        coll.findOne(keyValuePair)
            .then(
                (res) => dbRespond(callback, undefined, res),
                (err) => dbRespond(callback, err)
            );
    } else dbRespond(callback, dbErrMsg.noQueryData);
};
/**
 * Helper Function
 * Creates object formatted for input to getItemByKeyValue()
 * @private
 * @param {string} key
 * @param value
 * @return Properly formatted object
 */
const createKeyValuePair = (key, value) => {
    let keyValuePair = {};
    keyValuePair[key] = value;
    keyValuePair.value = value;
    return keyValuePair;
};
// Key names for use in calls to above method
const usernameKey = 'username';
const IDKey = '_id';

/**
 * Retrieves all of the items created by the User with the given userID from given collection
 * @private
 * @param {string} userID ID of user that created items to retrieve from database
 * @param {string} collectionName Collection that contains items
 * @param {function} callback Called with error or result upon Promise return from database operation
 * @res Array of items found (empty array if none found) or undefined if error
 * @err Database error, Undefined if no error
 */
const getItemsByUserID = (userID, collectionName, callback) => {
    if (userID)
    {
        let coll = db.collection(collectionName);
        coll.find({userID: userID})
            .toArray()
            .then(
                (res) => dbRespond(callback, undefined, res),
                (err) => dbRespond(callback, err)
            );
    } else dbRespond(callback, dbErrMsg.noQueryData);
};

/**
 * Replaces item's current database entry with given item
 * Matches entry by ID, therefore item must have property "_id" with proper value
 * @private
 * @param {object} item Item to become new entry
 * @param {object} itemSchema Schema to use in item format validation
 * @param {string} collectionName Collection that contains item
 * @param {function} callback Called with error or result upon Promise return from database operation
 * @res Updated item if original item found, null if not found, undefined if error
 * @err No entry data specified, No ID specified, Improper entry format + validation error, Database error, or Undefined if no error
 */
const updateItem = (item, itemSchema, collectionName, callback) => {
    const validation = validate(item, itemSchema);
    if (!item) dbRespond(callback, dbErrMsg.noEntryData);
    else if (!item._id) dbRespond(callback, dbErrMsg.noID);
    else if (validation.error) dbRespond(callback, dbErrMsg.improperEntryFormat + validation.error);
    else
    {
        let coll = db.collection(collectionName);
        let newItem = Object.assign({}, item);
        if (ObjectID.isValid(newItem._id)) newItem._id = ObjectID(item._id);
        else {
            dbRespond(callback, dbErrMsg.improperIDFormat);
            return;
        }
        coll.findOneAndReplace({ _id: newItem._id }, newItem, { returnOriginal: false })
            .then(
                (res) => dbRespond(callback, undefined, res.value),
                (err) => dbRespond(callback, err)
            );
    }
};

/**
 * Deletes an item with the given key value pair from database
 * @private
 * @param {object} keyValuePair
 * Key value pair by which to search for item to delete from database
 * For definition check, must also contain 'value' property with value equivalent to surrounding function's caller's query value
 * 'value' property is deleted after check if value is defined
 * @param {string} collectionName Collection that contains item
 * @param {function} callback Called with error or result upon Promise return from database operation
 * @res Deleted item if found and deleted, null if not found, undefined if error
 * @err Database error, Improper ID format, Undefined if no error
 */
const deleteItemByKeyValue = (keyValuePair, collectionName, callback) => {
    if (keyValuePair.value)
    {
        delete keyValuePair.value;
        if (keyValuePair.hasOwnProperty(IDKey)) {
            if (ObjectID.isValid(keyValuePair[IDKey])) keyValuePair[IDKey] = ObjectID(keyValuePair[IDKey]);
            else {
                dbRespond(callback, dbErrMsg.improperIDFormat);
                return;
            }
        }
        let coll = db.collection(collectionName);
        coll.findOneAndDelete(keyValuePair)
            .then(
                (res) => dbRespond(callback, undefined, res.value),
                (err) => dbRespond(callback, err)
            );
    } else dbRespond(callback, dbErrMsg.noQueryData);
};

const dataAccess = {
    /**
     * Create new User item in database from given valid User object
     * Calls {@link module:dbConnector~createItem}
     * @memberOf module:dbConnector
     * @param {object} user
     * @param {function} callback
     */
    createUser: (user, callback) => {
        createItem(user, dbSchemas.user, dbCollNames.user, callback);
    },
    /**
     * Get User object by given username
     * Calls {@link module:dbConnector~getItemByKeyValue}
     * @memberOf module:dbConnector
     * @param {string} username
     * @param {function} callback
     */
     getUserByUsername: (username, callback) => {
        getItemByKeyValue(createKeyValuePair(usernameKey, username), dbCollNames.user, callback);
    },
    /**
     * Get User object by given ID
     * Calls {@link module:dbConnector~getItemByKeyValue}
     * @memberOf module:dbConnector
     * @param {string} userID
     * @param {function} callback
     */
    getUserByID: (userID, callback) => {
        getItemByKeyValue(createKeyValuePair(IDKey, userID), dbCollNames.user, callback);
    },
    /**
     * Update (replace) User database entry with given valid User object
     * Calls {@link module:dbConnector~updateItem}
     * @memberOf module:dbConnector
     * @param {object} user
     * @param {function} callback
     */
    updateUser: (user, callback) => {
        updateItem(user, dbSchemas.user, dbCollNames.user, callback);
    },
    /**
     * Delete Piece object with given ID from database
     * Calls {@link module:dbConnector~deleteItemByKeyValue}
     * @memberOf module:dbConnector
     * @param {string} userID
     * @param {function} callback
     */
    deleteUserByID: (userID, callback) => {
        deleteItemByKeyValue(createKeyValuePair(IDKey, userID), dbCollNames.user, callback);
    },

    /**
     * Create new Piece item in database from given valid Piece object
     * Calls {@link module:dbConnector~createItem}
     * @memberOf module:dbConnector
     * @param {object} piece
     * @param {function} callback
     */
    createPiece: (piece, callback) => {
        createItem(piece, dbSchemas.piece, dbCollNames.piece, callback);
    },
    /**
     * Get Piece object by given ID
     * Calls {@link module:dbConnector~getItemByKeyValue}
     * @memberOf module:dbConnector
     * @param {string} pieceID
     * @param {function} callback
     */
    getPieceByID: (pieceID, callback) => {
        getItemByKeyValue(createKeyValuePair(IDKey, pieceID), dbCollNames.piece, callback);
    },
    /**
     * Get all Piece objects in database created by User with given ID
     * Calls {@link module:dbConnector~getItemsByUserID}
     * @memberOf module:dbConnector
     * @param {string} userID
     * @param {function} callback
     */
    getPiecesByUserID: (userID, callback) => {
        getItemsByUserID(userID, dbCollNames.piece, callback);
    },
    /**
     * Update (replace) Piece database entry with given valid Piece object
     * Calls {@link module:dbConnector~updateItem}
     * @memberOf module:dbConnector
     * @param {object} piece
     * @param {function} callback
     */
    updatePiece: (piece, callback) => {
        updateItem(piece, dbSchemas.piece, dbCollNames.piece, callback);
    },
    /**
     * Delete Piece object with given ID from database
     * Calls {@link module:dbConnector~deleteItemByKeyValue}
     * @memberOf module:dbConnector
     * @param {string} pieceID
     * @param {function} callback
     */
    deletePieceByID: (pieceID, callback) => {
        deleteItemByKeyValue(createKeyValuePair(IDKey, pieceID), dbCollNames.piece, callback);
    },

    /**
     * Create new Gameboard item in database from given valid Gameboard object
     * Calls {@link module:dbConnector~createItem}
     * @memberOf module:dbConnector
     * @param {object} gameboard
     * @param {function} callback
     */
    createGameboard: (gameboard, callback) => {
        createItem(gameboard, dbSchemas.gameboard, dbCollNames.gameboard, callback);
    },
    /**
     * Get Gameboard object by given ID
     * Calls {@link module:dbConnector~getItemByKeyValue}
     * @memberOf module:dbConnector
     * @param {string} gameboardID
     * @param {function} callback
     */
    getGameboardByID: (gameboardID, callback) => {
        getItemByKeyValue(createKeyValuePair(IDKey, gameboardID), dbCollNames.gameboard, callback);
    },
    /**
     * Get all Gameboard objects in database created by User with given ID
     * Calls {@link module:dbConnector~getItemsByUserID}
     * @memberOf module:dbConnector
     * @param {string} userID
     * @param {function} callback
     */
    getGameboardsByUserID: (userID, callback) => {
        getItemsByUserID(userID, dbCollNames.gameboard, callback);
    },
    /**
     * Update (replace) Gameboard database entry with given valid Gameboard object
     * Calls {@link module:dbConnector~updateItem}
     * @memberOf module:dbConnector
     * @param {object} gameboard
     * @param {function} callback
     */
    updateGameboard: (gameboard, callback) => {
        updateItem(gameboard, dbSchemas.gameboard, dbCollNames.gameboard, callback);
    },
    /**
     * Delete Gameboard object with given ID from database
     * Calls {@link module:dbConnector~deleteItemByKeyValue}
     * @memberOf module:dbConnector
     * @param {string} gameboardID
     * @param {function} callback
     */
    deleteGameboardByID: (gameboardID, callback) => {
        deleteItemByKeyValue(createKeyValuePair(IDKey, gameboardID), dbCollNames.gameboard, callback);
    },

    /**
     * Create new Gamestate item in database from given valid Gameboard object
     * Calls {@link module:dbConnector~createItem}
     * @memberOf module:dbConnector
     * @param {object} gamestate
     * @param {function} callback
     */
    createGamestate: (gamestate, callback) => {
        createItem(gamestate, dbSchemas.gamestate, dbCollNames.gamestate, callback);
    },
    /**
     * Get Gamestate object by given ID
     * Calls {@link module:dbConnector~getItemByKeyValue}
     * @memberOf module:dbConnector
     * @param {string} gamestateID
     * @param {function} callback
     */
    getGamestateByID: (gamestateID, callback) => {
        getItemByKeyValue(createKeyValuePair(IDKey, gamestateID), dbCollNames.gamestate, callback);
    },
    /**
     * Update (replace) Gamestate database entry with given valid Gamestate object
     * Calls {@link module:dbConnector~updateItem}
     * @memberOf module:dbConnector
     * @param {object} gamestate
     * @param {function} callback
     */
    updateGamestate: (gamestate, callback) => {
        updateItem(gamestate, dbSchemas.gamestate, dbCollNames.gamestate, callback);
    },
    /**
     * Delete Gamestate object with given ID from database
     * Calls {@link module:dbConnector~deleteItemByKeyValue}
     * @memberOf module:dbConnector
     * @param {string} gamestateID
     * @param {function} callback
     */
    deleteGamestateByID: (gamestateID, callback) => {
        deleteItemByKeyValue(createKeyValuePair(IDKey, gamestateID), dbCollNames.gamestate, callback);
    },
};

const connection = {
    /**
     * Call to connect to database. If connection fails, connection will be attempted again every 5 seconds.
     * @memberOf module:dbConnector
     * @param {object} app Express app that will use database dependent modules
     * @param {string} host Database host address
     * @param {array} dependentModules Array of modules functions to be called with the database object as a parameter
     * @param {function} callback Called with db object as parameter
     */
    connect: function (app, host, dependentModules, callback) {
        mongodb.MongoClient.connect(host, (err, db) => {
            if (err) {
                console.error(dbErrMsg.connect);
                setTimeout(() => {
                    this.connect(app, host, dependentModules, callback);
                }, 5000);
                return;
            }
            console.log(new Date().toLocaleTimeString() + ' | Connected to database:', db.s.databaseName);
            for (let moduleIndex in dependentModules) {
                app.use(dependentModules[moduleIndex](db));
            }
            callback(db);
        });
    },
};

/**
 * Module will export database access methods if parameter database is defined.
 * If it is not, connection methods will be exported.
 * @param {object} database Database object from returned connection or undefined
 * @return {object} Database access or connection methods
 */
module.exports = (database) => {
    if (database) {
        db = database;
        // Create any Database Collections not present
        db.listCollections().toArray().then((res) => {
            let names = [];
            res.forEach((coll) => names.push(coll.name));
            Object.keys(dbCollNames).forEach((collNameKey) => {
                if (!names.includes(dbCollNames[collNameKey]))
                    db.createCollection(dbCollNames[collNameKey]).catch((err) => console.error(dbErrMsg.collCreation, err));
            });
        }, (err) => console.error(dbErrMsg.collList, err));
        return dataAccess;
    }
    else return connection;
};