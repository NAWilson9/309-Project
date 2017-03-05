//Link dependencies
const mongodb = require('mongodb');
const Joi = require('joi');
const ObjectID = mongodb.ObjectID;

const userSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    _id: Joi.string().optional(),
});

const pieceSchema = Joi.object().keys({
    name: Joi.string().required(),
    userID: Joi.string().required(),
    _id: Joi.string().optional(),
});

const gameboardSchema = Joi.object().keys({
    name: Joi.string().required(),
    userID: Joi.string().required(),
    _id: Joi.string().optional(),
});

const dbRespond = (callback, err, res) => {
    if (callback) {
        callback(err, res);
    }
};

/**
 * Adds a given valid item to given collection
 * @param item
 * Object to insert into database
 * @param itemSchema
 * Schema to use in item format validation
 * @param collectionName
 * Collection that contains item
 * @param callback
 * Called with error or result upon Promise return from database operation
 * @res
 * Object inserted into database
 * @err
 * No entry data specified, Improper entry format + validation error, or database insertion error
 */
const createItem = (item, itemSchema, collectionName, callback) => {
    const validation = Joi.validate(item, itemSchema);
    if (!item) dbRespond(callback, 'No entry data specified');
    else if (validation.error) dbRespond(callback, 'Improper entry format\n' + validation.error);
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
 * @param keyValuePair
 * Key value pair by which to search for item to retrieve from database
 * Also must contain 'value' property with value equivalent to key value pair's value for definition check
 * 'value' property is deleted after check if value is defined
 * @param callback
 * Called with error or result upon Promise return from database operation
 * @res
 * Item if found, undefined if not
 * @err
 * Database query error
 */
const getItemByKeyValue = (keyValuePair, collectionName, callback) => {
    if (keyValuePair.value)
    {
        delete keyValuePair.value;
        let coll = db.collection(collectionName);
        coll.findOne(keyValuePair)
            .then(
                (res) => dbRespond(callback, undefined, res),
                (err) => dbRespond(callback, err)
            );
    } else dbRespond(callback, 'No query data specified');
};

/**
 * Retrieves all of the items created by the User with the given userID from given collection
 * @param userID
 * ID of user that created items to retrieve from database
 * @param collectionName
 * Collection that contains items
 * @param callback
 * Called with error or result upon Promise return from database operation
 * @res
 * Array of items if found, undefined if not
 * @err
 * Array creation error or Database query error
 */
const getItemsByUserID = (userID, collectionName, callback) => {
    if (userID)
    {
        let coll = db.collection(collectionName);
        // console.log(coll.find());
        console.log(userID);
        coll.find({userID: userID})
            .toArray((err) => dbRespond(callback, err))
            .then(
                (res) => dbRespond(callback, undefined, res),
                (err) => dbRespond(callback, err)
            );
    } else dbRespond(callback, 'No query data specified');
};

/**
 * Replaces item's current database entry with given item
 * Matches entry by ID, therefore item must have property "_id" with proper value
 * @param item
 * Item to become new entry
 * @param itemSchema
 * Schema to use in item format validation
 * @param collectionName
 * Collection that contains item
 * @param callback
 * Called with error or result upon Promise return from database operation
 * @res
 * Updated item if successful, null if not
 * @err
 * No entry data specified, Improper entry format + validation error, or database replacement error
 */
const updateItem = (item, itemSchema, collectionName, callback) => {
    const validation = Joi.validate(item, userSchema);
    if (!item) dbRespond(callback, 'No entry data specified');
    else if (validation.error) dbRespond(callback, 'Improper entry format\n' + validation.error);
    else
    {
        let coll = db.collection(collectionName);
        let newItem = Object.assign({}, item);
        newItem._id = ObjectID(item._id);
        coll.findOneAndReplace({ _id: newItem._id }, newItem, { returnOriginal: false })
            .then(
                (res) => dbRespond(callback, undefined, res.value),
                (err) => dbRespond(callback, err)
            );
    }
};


let db;
const dbConnector = {
    createUser: (user, callback) => {
        createItem(user, userSchema, 'users', callback);
    },
    getUserByUsername: (username, callback) => {
        const keyValuePair = { username: username, value: username };
        getItemByKeyValue(keyValuePair, 'users', callback);
    },
    updateUser: (user, callback) => {
        updateItem(user, userSchema, 'users', callback);
    },
    createPiece: (piece, callback) => {
        createItem(piece, pieceSchema, 'pieces', callback);
    },
    getPieceByID: (pieceID, callback) => {
        const ID = ObjectID(pieceID);
        const keyValuePair = { _id: ID, value: ID };
        getItemByKeyValue(keyValuePair, 'pieces', callback);
    },
    getPiecesByUserID: (userID, callback) => {
        getItemsByUserID(userID, 'pieces', callback);
    },
    updatePiece: (piece, callback) => {
        updateItem(piece, pieceSchema, 'pieces', callback);
    },
    createGameboard: (gameboard, callback) => {
        createItem(gameboard, gameboardSchema, 'gameboards', callback);
    },
    getGameboardByID: (gameboardID, callback) => {
        const ID = ObjectID(gameboardID);
        const keyValuePair = { _id: ID, value: ID };
        getItemByKeyValue(keyValuePair, 'gameboards', callback);
    },
    getGameboardsByUserID: (userID, callback) => {
        getItemsByUserID(userID, 'gameboards', callback);
    },
    updateGameboard: (gameboard, callback) => {
        updateItem(gameboard, gameboardSchema, 'gameboards', callback);
    },
};

module.exports = (database) => {
    db = database;
    return dbConnector;
};