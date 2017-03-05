//Link dependencies
const mongodb = require('mongodb');
const Joi = require('joi');
const ObjectID = mongodb.ObjectID;

let db;
const collNames = {
    user: 'users',
    piece: 'pieces',
    gameboard:  'gameboards',
};
const schemas = {
    user: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
        _id: Joi.string().optional(),
    }),
    piece: Joi.object().keys({
        name: Joi.string().required(),
        userID: Joi.string().required(),
        _id: Joi.string().optional(),
    }),
    gameboard: Joi.object().keys({
        name: Joi.string().required(),
        userID: Joi.string().required(),
        _id: Joi.string().optional(),
    }),
};
const dbRespond = (callback, err, res) => {
    if (callback) {
        callback(err, res);
    }
};

const errMsg = {
    noEntryData: 'No entry data specified',
    noQueryData: 'No query data specified',
    improperEntryFormat: 'Improper entry format - ',
    improperIDFormat: 'Improper ID format',
    noID: 'Must specify item ID',
    collCreation: 'Error creating collection',
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
    if (!item) dbRespond(callback, errMsg.noEntryData);
    else if (validation.error) dbRespond(callback, errMsg.improperEntryFormat + validation.error);
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
 * For definition check, must also contain 'value' property with value equivalent to surrounding function's caller's query value
 * 'value' property is deleted after check if value is defined
 * @param collectionName
 * Collection that contains item
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
        if (keyValuePair.hasOwnProperty(IDKey)) {
            if (ObjectID.isValid(keyValuePair[IDKey])) keyValuePair[IDKey] = ObjectID(keyValuePair[IDKey]);
            else {
                dbRespond(callback, errMsg.improperIDFormat);
                return;
            }
        }
        let coll = db.collection(collectionName);
        coll.findOne(keyValuePair)
            .then(
                (res) => dbRespond(callback, undefined, res),
                (err) => dbRespond(callback, err)
            );
    } else dbRespond(callback, errMsg.noQueryData);
};
const createKeyValuePair = (key, value) => {
    let keyValuePair = {};
    keyValuePair[key] = value;
    keyValuePair.value = value;
    return keyValuePair;
};
const usernameKey = 'username';
const IDKey = '_id';

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
 * Database query error
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
    } else dbRespond(callback, errMsg.noQueryData);
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
    const validation = Joi.validate(item, itemSchema);
    if (!item) dbRespond(callback, errMsg.noEntryData);
    else if (!item._id) dbRespond(callback, errMsg.noID);
    else if (validation.error) dbRespond(callback, errMsg.improperEntryFormat + validation.error);
    else
    {
        let coll = db.collection(collectionName);
        let newItem = Object.assign({}, item);
        if (ObjectID.isValid(newItem._id)) newItem._id = ObjectID(item._id);
        else {
            dbRespond(callback, errMsg.improperIDFormat);
            return;
        }
        coll.findOneAndReplace({ _id: newItem._id }, newItem, { returnOriginal: false })
            .then(
                (res) => dbRespond(callback, undefined, res.value),
                (err) => dbRespond(callback, err)
            );
    }
};

const deleteItemByKeyValue = (keyValuePair, collectionName, callback) => {
    if (keyValuePair.value)
    {
        delete keyValuePair.value;
        if (keyValuePair.hasOwnProperty(IDKey)) {
            if (ObjectID.isValid(keyValuePair[IDKey])) keyValuePair[IDKey] = ObjectID(keyValuePair[IDKey]);
            else {
                dbRespond(callback, errMsg.improperIDFormat);
                return;
            }
        }
        let coll = db.collection(collectionName);
        coll.deleteOne(keyValuePair)
            .then(
                (res) => dbRespond(callback, undefined, res),
                (err) => dbRespond(callback, err)
            );
    } else dbRespond(callback, errMsg.noQueryData);
};


const dbConnector = {
    createUser: (user, callback) => {
        createItem(user, schemas.user, collNames.user, callback);
    },
    getUserByUsername: (username, callback) => {
        getItemByKeyValue(createKeyValuePair(usernameKey, username), collNames.user, callback);
    },
    getUserByID: (userID, callback) => {
        getItemByKeyValue(createKeyValuePair(IDKey, userID), collNames.user, callback);
    },
    updateUser: (user, callback) => {
        updateItem(user, schemas.user, collNames.user, callback);
    },

    createPiece: (piece, callback) => {
        createItem(piece, schemas.piece, collNames.piece, callback);
    },
    getPieceByID: (pieceID, callback) => {
        getItemByKeyValue(createKeyValuePair(IDKey, pieceID), collNames.piece, callback);
    },
    getPiecesByUserID: (userID, callback) => {
        getItemsByUserID(userID, collNames.piece, callback);
    },
    updatePiece: (piece, callback) => {
        updateItem(piece, schemas.piece, collNames.piece, callback);
    },

    createGameboard: (gameboard, callback) => {
        createItem(gameboard, schemas.gameboard, collNames.gameboard, callback);
    },
    getGameboardByID: (gameboardID, callback) => {
        getItemByKeyValue(createKeyValuePair(IDKey, gameboardID), collNames.gameboard, callback);
    },
    getGameboardsByUserID: (userID, callback) => {
        getItemsByUserID(userID, collNames.gameboard, callback);
    },
    updateGameboard: (gameboard, callback) => {
        updateItem(gameboard, schemas.gameboard, collNames.gameboard, callback);
    },
};

module.exports = (database) => {
    db = database;
    db.listCollections().toArray().then((res) => {
        let names = [];
        res.forEach((coll) => names.push(coll.name));
        Object.keys(collNames).forEach((collNameKey) => {
            if (!names.includes(collNames[collNameKey]))
                db.createCollection(collNames[collNameKey]).catch((err) => console.error(errMsg.collCreation));
        });
    }, (err) => {});
    return dbConnector;
};