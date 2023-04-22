"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('formio:db');
const error = require('debug')('formio:error');
const pick = require('lodash/pick');
const omit = require('lodash/omit');
class Database {
    constructor(config) {
        this.config = config;
        this.db = null;
        this.currentCollectionName = 'submissions';
        this.currentCollection = null;
        this.defaultCollection = null;
    }
    ObjectId(id) {
        if (id === null || id === void 0 ? void 0 : id.hasOwnProperty('$in')) {
            return { $in: id['$in'].map((_id) => this.ObjectId(_id)) };
        }
        try {
            return id ? (new ObjectId(id)) : null;
        }
        catch (e) {
            return id;
        }
    }
    /**
     * Connect to the database.
     * @param {*} scope
     * @returns
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                debug('db.connect()');
                const config = this.config.config ? JSON.parse(this.config.config) : {};
                const client = new MongoClient(this.config.url, config);
                yield client.connect();
                this.db = yield client.db();
                this.addIndex(this.db.collection('project'), 'name');
                this.defaultCollection = this.db.collection('submissions');
                yield this.setupIndexes(this.defaultCollection);
                debug('Connected to database');
            }
            catch (err) {
                error(err.message);
                process.exit();
            }
        });
    }
    // Generic save record method.
    save(collectionName, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.db.collection(collectionName);
            let result;
            try {
                debug('db.save()', collectionName);
                result = yield collection.findOneAndUpdate({ _id: this.ObjectId(item._id) }, { $set: omit(item, '_id') }, { upsert: true, returnOriginal: false });
            }
            catch (err) {
                error(err.message);
            }
            return result ? result.value : null;
        });
    }
    // Generic load record method.
    load(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('db.load()', collectionName);
            const collection = this.db.collection(collectionName);
            let item;
            try {
                item = yield collection.findOne({});
            }
            catch (err) {
                error(err.message);
            }
            return item;
        });
    }
    // Get the collection to use for the call.
    collection(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (scope && scope.form && scope.form.settings && scope.form.settings.collection) {
                if (this.currentCollection && this.currentCollectionName === scope.form.settings.collection) {
                    return this.currentCollection;
                }
                let collection;
                try {
                    debug('db.createCollection()', scope.form.settings.collection);
                    yield this.db.createCollection(scope.form.settings.collection);
                    collection = this.db.collection(scope.form.settings.collection);
                    this.setupIndexes(collection, scope);
                }
                catch (err) {
                    error(err.message);
                }
                this.currentCollection = collection || this.db.collection(scope.form.settings.collection);
                this.currentCollectionName = scope.form.settings.collection;
                return this.currentCollection;
            }
            return this.defaultCollection;
        });
    }
    /**
     * Setup indexes.
     */
    setupIndexes(collection, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            this.addIndex(collection, 'project');
            this.addIndex(collection, 'form');
            this.addIndex(collection, 'deleted');
            this.addIndex(collection, 'modified');
            this.addIndex(collection, 'created');
            if (scope && scope.form && scope.form.components) {
                scope.utils.eachComponent(scope.form.components, (component, components, path) => {
                    if (component.dbIndex) {
                        this.addIndex(collection, `data.${path}`);
                    }
                });
            }
        });
    }
    /**
     * Add a field index
     */
    addIndex(collection, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = {};
            index[path] = 1;
            try {
                debug('db.addIndex()', path);
                collection.createIndex(index, { background: true });
            }
            catch (err) {
                error(err.message);
            }
        });
    }
    /**
     * Remove a field index.
     */
    removeIndex(collection, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = {};
            index[path] = 1;
            try {
                debug('db.removeIndex()', path);
                collection.dropIndex(index);
            }
            catch (err) {
                error(`Cannot remove index ${path}`);
            }
        });
    }
    /**
     * Fetch a list of submissions from a table/collection.
     * @param {*} table
     * @param {*} query
     */
    index(scope, query = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let items;
            try {
                debug('db.index()', query);
                items = yield this.find(scope, query);
            }
            catch (err) {
                error(err.message);
            }
            return items;
        });
    }
    /**
     * Create a new record.
     */
    create(scope, record, allowFields = []) {
        return __awaiter(this, void 0, void 0, function* () {
            record.deleted = null;
            record.created = new Date();
            record.modified = new Date();
            if (scope.form && scope.form._id) {
                record.form = this.ObjectId(scope.form._id);
            }
            if (scope.project && scope.project._id) {
                record.project = this.ObjectId(scope.project._id);
            }
            if (record.owner) {
                record.owner = this.ObjectId(record.owner);
            }
            const collection = yield this.collection(scope);
            try {
                debug('db.create()', record);
                const result = yield collection.insertOne(pick(record, [
                    'data',
                    'metadata',
                    'modified',
                    'created',
                    'deleted',
                    'form',
                    'project',
                    'owner',
                    'access'
                ].concat(allowFields)));
                if (!result.insertedId) {
                    return null;
                }
                return yield this.read(scope, result.insertedId);
            }
            catch (err) {
                error(err.message);
            }
        });
    }
    /**
     * Return a query for a single mongo record.
     * @param {*} form
     * @param {*} id
     * @returns
     */
    query(scope, query) {
        if (query._id) {
            query._id = this.ObjectId(query._id);
        }
        if (query.owner) {
            query.owner = this.ObjectId(query.owner);
        }
        if (query.form) {
            query.form = this.ObjectId(query.form);
        }
        else if (scope.form && scope.form._id) {
            query.form = this.ObjectId(scope.form._id);
        }
        if (scope.project && scope.project._id) {
            query.project = this.ObjectId(scope.project._id);
        }
        query.deleted = { $eq: null };
        // Handle nested queries.
        ['$or', '$and'].forEach((key) => {
            if (query[key]) {
                query[key].forEach((subQuery) => this.query(scope, subQuery));
            }
        });
        return query;
    }
    /**
     * Find many records that match a query.
     */
    find(scope, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                debug('db.find()', query);
                const collection = yield this.collection(scope);
                return yield collection.find(this.query(scope, query)).toArray();
            }
            catch (err) {
                error(err.message);
            }
        });
    }
    /**
     * Find a record for a provided query.
     */
    findOne(scope, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                debug('db.findOne()', query);
                const collection = yield this.collection(scope);
                return yield collection.findOne(this.query(scope, query));
            }
            catch (err) {
                error(err.message);
            }
        });
    }
    /**
     * Read a single submission from a form
     *
     * @param {*} table
     * @param {*} query
     */
    read(scope, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                debug('db.read()', id);
                const collection = yield this.collection(scope);
                return yield collection.findOne(this.query(scope, { _id: id }));
            }
            catch (err) {
                error(err.message);
            }
        });
    }
    /**
     * Update a single submission of a form.
     *
     * @param {*} table
     * @param {*} query
     */
    update(scope, id, update, allowFields = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !update) {
                return null;
            }
            update.modified = new Date();
            try {
                debug('db.update()', id, update);
                const collection = yield this.collection(scope);
                const result = yield collection.updateOne(this.query(scope, { _id: id }), {
                    $set: pick(update, ['data', 'metadata', 'modified'].concat(allowFields))
                });
                if (result.modifiedCount === 0) {
                    return null;
                }
                return yield this.read(scope, id);
            }
            catch (err) {
                error(err.message);
            }
        });
    }
    /**
     * Delete a record from the database.
     */
    delete(scope, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                return false;
            }
            try {
                debug('db.delete()', id);
                const collection = yield this.collection(scope);
                const result = yield collection.updateOne(this.query(scope, { _id: id }), { $set: { deleted: Date.now() } });
                return result.modifiedCount > 0;
            }
            catch (err) {
                error(err.message);
            }
        });
    }
}
module.exports = Database;
