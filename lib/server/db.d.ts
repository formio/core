export = Database;
declare class Database {
    constructor(config: any);
    config: any;
    db: any;
    currentCollectionName: string;
    currentCollection: any;
    defaultCollection: any;
    ObjectId(id: any): any;
    /**
     * Connect to the database.
     * @param {*} scope
     * @returns
     */
    connect(): Promise<void>;
    save(collectionName: any, item: any): Promise<any>;
    load(collectionName: any): Promise<any>;
    collection(scope: any): Promise<any>;
    /**
     * Setup indexes.
     */
    setupIndexes(collection: any, scope: any): Promise<void>;
    /**
     * Add a field index
     */
    addIndex(collection: any, path: any): Promise<void>;
    /**
     * Remove a field index.
     */
    removeIndex(collection: any, path: any): Promise<void>;
    /**
     * Fetch a list of submissions from a table/collection.
     * @param {*} table
     * @param {*} query
     */
    index(scope: any, query?: any): Promise<any>;
    /**
     * Create a new record.
     */
    create(scope: any, record: any, allowFields?: any[]): Promise<any>;
    /**
     * Return a query for a single mongo record.
     * @param {*} form
     * @param {*} id
     * @returns
     */
    query(scope: any, query: any): any;
    /**
     * Find many records that match a query.
     */
    find(scope: any, query: any): Promise<any>;
    /**
     * Find a record for a provided query.
     */
    findOne(scope: any, query: any): Promise<any>;
    /**
     * Read a single submission from a form
     *
     * @param {*} table
     * @param {*} query
     */
    read(scope: any, id: any): Promise<any>;
    /**
     * Update a single submission of a form.
     *
     * @param {*} table
     * @param {*} query
     */
    update(scope: any, id: any, update: any, allowFields?: any[]): Promise<any>;
    /**
     * Delete a record from the database.
     */
    delete(scope: any, id: any): Promise<boolean | undefined>;
}
