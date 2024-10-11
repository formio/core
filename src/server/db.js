const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('formio:db');
const error = require('debug')('formio:error');
import { pick, omit } from 'lodash';
class Database {
  constructor(config) {
    this.config = config;
    this.db = null;
    this.currentCollectionName = 'submissions';
    this.currentCollection = null;
    this.defaultCollection = null;
  }

  ObjectId(id) {
    if (id?.hasOwnProperty('$in')) {
      return { $in: id['$in'].map((_id) => this.ObjectId(_id)) };
    }
    try {
      return id ? new ObjectId(id) : null;
    } catch (e) {
      return id;
    }
  }

  /**
   * Connect to the database.
   * @param {*} scope
   * @returns
   */
  async connect() {
    try {
      debug('db.connect()');
      const config = this.config.config ? JSON.parse(this.config.config) : {};
      const client = new MongoClient(this.config.url, config);
      await client.connect();
      this.db = await client.db();
      this.addIndex(this.db.collection('project'), 'name');
      this.defaultCollection = this.db.collection('submissions');
      await this.setupIndexes(this.defaultCollection);
      debug('Connected to database');
    } catch (err) {
      error(err.message);
      process.exit();
    }
  }

  // Generic save record method.
  async save(collectionName, item) {
    const collection = this.db.collection(collectionName);
    let result;
    try {
      debug('db.save()', collectionName);
      result = await collection.findOneAndUpdate(
        { _id: this.ObjectId(item._id) },
        { $set: omit(item, '_id') },
        { upsert: true, returnOriginal: false },
      );
    } catch (err) {
      error(err.message);
    }
    return result ? result.value : null;
  }

  // Generic load record method.
  async load(collectionName) {
    debug('db.load()', collectionName);
    const collection = this.db.collection(collectionName);
    let item;
    try {
      item = await collection.findOne({});
    } catch (err) {
      error(err.message);
    }
    return item;
  }

  // Get the collection to use for the call.
  async collection(scope) {
    if (scope && scope.form && scope.form.settings && scope.form.settings.collection) {
      if (this.currentCollection && this.currentCollectionName === scope.form.settings.collection) {
        return this.currentCollection;
      }
      let collection;
      try {
        debug('db.createCollection()', scope.form.settings.collection);
        await this.db.createCollection(scope.form.settings.collection);
        collection = this.db.collection(scope.form.settings.collection);
        this.setupIndexes(collection, scope);
      } catch (err) {
        error(err.message);
      }
      this.currentCollection = collection || this.db.collection(scope.form.settings.collection);
      this.currentCollectionName = scope.form.settings.collection;
      return this.currentCollection;
    }
    return this.defaultCollection;
  }

  /**
   * Setup indexes.
   */
  async setupIndexes(collection, scope) {
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
  }

  /**
   * Add a field index
   */
  async addIndex(collection, path) {
    const index = {};
    index[path] = 1;
    try {
      debug('db.addIndex()', path);
      collection.createIndex(index, { background: true });
    } catch (err) {
      error(err.message);
    }
  }

  /**
   * Remove a field index.
   */
  async removeIndex(collection, path) {
    const index = {};
    index[path] = 1;
    try {
      debug('db.removeIndex()', path);
      collection.dropIndex(index);
    } catch (err) {
      error(`Cannot remove index ${path}`);
    }
  }

  /**
   * Fetch a list of submissions from a table/collection.
   * @param {*} table
   * @param {*} query
   */
  async index(scope, query = {}) {
    let items;
    try {
      debug('db.index()', query);
      items = await this.find(scope, query);
    } catch (err) {
      error(err.message);
    }
    return items;
  }

  /**
   * Create a new record.
   */
  async create(scope, record, allowFields = []) {
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
    const collection = await this.collection(scope);
    try {
      debug('db.create()', record);
      const result = await collection.insertOne(
        pick(
          record,
          [
            'data',
            'metadata',
            'modified',
            'created',
            'deleted',
            'form',
            'project',
            'owner',
            'access',
          ].concat(allowFields),
        ),
      );
      if (!result.insertedId) {
        return null;
      }
      return await this.read(scope, result.insertedId);
    } catch (err) {
      error(err.message);
    }
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
    } else if (scope.form && scope.form._id) {
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
  async find(scope, query) {
    try {
      debug('db.find()', query);
      const collection = await this.collection(scope);
      return await collection.find(this.query(scope, query)).toArray();
    } catch (err) {
      error(err.message);
    }
  }

  /**
   * Find a record for a provided query.
   */
  async findOne(scope, query) {
    try {
      debug('db.findOne()', query);
      const collection = await this.collection(scope);
      return await collection.findOne(this.query(scope, query));
    } catch (err) {
      error(err.message);
    }
  }

  /**
   * Read a single submission from a form
   *
   * @param {*} table
   * @param {*} query
   */
  async read(scope, id) {
    try {
      debug('db.read()', id);
      const collection = await this.collection(scope);
      return await collection.findOne(this.query(scope, { _id: id }));
    } catch (err) {
      error(err.message);
    }
  }

  /**
   * Update a single submission of a form.
   *
   * @param {*} table
   * @param {*} query
   */
  async update(scope, id, update, allowFields = []) {
    if (!id || !update) {
      return null;
    }
    update.modified = new Date();
    try {
      debug('db.update()', id, update);
      const collection = await this.collection(scope);
      const result = await collection.updateOne(this.query(scope, { _id: id }), {
        $set: pick(update, ['data', 'metadata', 'modified'].concat(allowFields)),
      });
      if (result.modifiedCount === 0) {
        return null;
      }
      return await this.read(scope, id);
    } catch (err) {
      error(err.message);
    }
  }

  /**
   * Delete a record from the database.
   */
  async delete(scope, id) {
    if (!id) {
      return false;
    }
    try {
      debug('db.delete()', id);
      const collection = await this.collection(scope);
      const result = await collection.updateOne(this.query(scope, { _id: id }), {
        $set: { deleted: Date.now() },
      });
      return result.modifiedCount > 0;
    } catch (err) {
      error(err.message);
    }
  }

  /**
   * Determine if a given entry is unique
   */
  async isUnique(scope) {}
}

module.exports = Database;
