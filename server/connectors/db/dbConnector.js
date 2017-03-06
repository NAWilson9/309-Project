//Link dependencies
const mongodb = require('mongodb');
const Joi = require('joi');
const ObjectID = mongodb.ObjectID;

let db;
const dbCollNames = {
    user: 'users',
    piece: 'pieces',
    gameboard:  'gameboards',
};

/**
 * Item Schemas for Joi input validation
 */
const dbSchemas = {
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

/**
 * Helper Function
 * Calls callback function with error and response if callback provided
 * @param callback
 * @param err
 * @param res
 */
const dbRespond = (callback, err, res) => {
    if (callback) {
        callback(err, res);
    }
};

const dbErrMsg = {
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
 * Item inserted into database or undefined if error
 * @err
 * No entry data specified, Improper entry format + validation error, Database error, or Undefined if no error
 */
const createItem = (item, itemSchema, collectionName, callback) => {
    const validation = Joi.validate(item, itemSchema);
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
 * @param keyValuePair
 * Key value pair by which to search for item to retrieve from database
 * For definition check, must also contain 'value' property with value equivalent to surrounding function's caller's query value
 * 'value' property is deleted after check if value is defined
 * @param collectionName
 * Collection that contains item
 * @param callback
 * Called with error or result upon Promise return from database operation
 * @res
 * Item if found, null if not, undefined if error
 * @err
 * Database error, Improper ID format, or Undefined if no error
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
 * @param key
 * @param value
 * @return
 * Properly formatted object
 *  {
 *      key: value,
 *      value: value
 *  }
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
 * @param userID
 * ID of user that created items to retrieve from database
 * @param collectionName
 * Collection that contains items
 * @param callback
 * Called with error or result upon Promise return from database operation
 * @res
 * Array of items found (empty array if none found) or undefined if error
 * @err
 * Database error, Undefined if no error
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
 * @param item
 * Item to become new entry
 * @param itemSchema
 * Schema to use in item format validation
 * @param collectionName
 * Collection that contains item
 * @param callback
 * Called with error or result upon Promise return from database operation
 * @res
 * Updated item if original item found, null if not found, undefined if error
 * @err
 * No entry data specified, No ID specified, Improper entry format + validation error, Database error, or Undefined if no error
 */
const updateItem = (item, itemSchema, collectionName, callback) => {
    const validation = Joi.validate(item, itemSchema);
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
 * @param keyValuePair
 * Key value pair by which to search for item to delete from database
 * For definition check, must also contain 'value' property with value equivalent to surrounding function's caller's query value
 * 'value' property is deleted after check if value is defined
 * @param collectionName
 * Collection that contains item
 * @param callback
 * Called with error or result upon Promise return from database operation
 * @res
 * Deleted item if found and deleted, null if not found, undefined if error
 * @err
 * Database error, Improper ID format, Undefined if no error
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
        console.log(keyValuePair);
        coll.findOneAndDelete(keyValuePair)
            .then(
                (res) => dbRespond(callback, undefined, res.value),
                (err) => dbRespond(callback, err)
            );
    } else dbRespond(callback, dbErrMsg.noQueryData);
};


const dbConnector = {
    createUser: (user, callback) => {
        createItem(user, dbSchemas.user, dbCollNames.user, callback);
    },
    getUserByUsername: (username, callback) => {
        getItemByKeyValue(createKeyValuePair(usernameKey, username), dbCollNames.user, callback);
    },
    getUserByID: (userID, callback) => {
        getItemByKeyValue(createKeyValuePair(IDKey, userID), dbCollNames.user, callback);
    },
    updateUser: (user, callback) => {
        updateItem(user, dbSchemas.user, dbCollNames.user, callback);
    },
    deleteUserByID: (userID, callback) => {
        deleteItemByKeyValue(createKeyValuePair(IDKey, userID), dbCollNames.user, callback);
    },

    createPiece: (piece, callback) => {
        createItem(piece, dbSchemas.piece, dbCollNames.piece, callback);
    },
    getPieceByID: (pieceID, callback) => {
        getItemByKeyValue(createKeyValuePair(IDKey, pieceID), dbCollNames.piece, callback);
    },
    getPiecesByUserID: (userID, callback) => {
        getItemsByUserID(userID, dbCollNames.piece, callback);
    },
    updatePiece: (piece, callback) => {
        updateItem(piece, dbSchemas.piece, dbCollNames.piece, callback);
    },
    deletePieceByID: (pieceID, callback) => {
        deleteItemByKeyValue(createKeyValuePair(IDKey, pieceID), dbCollNames.piece, callback);
    },

    createGameboard: (gameboard, callback) => {
        createItem(gameboard, dbSchemas.gameboard, dbCollNames.gameboard, callback);
    },
    getGameboardByID: (gameboardID, callback) => {
        getItemByKeyValue(createKeyValuePair(IDKey, gameboardID), dbCollNames.gameboard, callback);
    },
    getGameboardsByUserID: (userID, callback) => {
        getItemsByUserID(userID, dbCollNames.gameboard, callback);
    },
    updateGameboard: (gameboard, callback) => {
        updateItem(gameboard, dbSchemas.gameboard, dbCollNames.gameboard, callback);
    },
    deleteGameboardByID: (gameboardID, callback) => {
        deleteItemByKeyValue(createKeyValuePair(IDKey, gameboardID), dbCollNames.gameboard, callback);
    },
};

module.exports = (database) => {
    db = database;
    // Create any Database Collections not present
    db.dropCollection("gameboards");
    db.listCollections().toArray().then((res) => {
        let names = [];
        res.forEach((coll) => names.push(coll.name));
        Object.keys(dbCollNames).forEach((collNameKey) => {
            if (!names.includes(dbCollNames[collNameKey]))
                db.createCollection(dbCollNames[collNameKey]).catch((err) => console.error(dbErrMsg.collCreation));
        });
    }, (err) => {});
    return dbConnector;
};