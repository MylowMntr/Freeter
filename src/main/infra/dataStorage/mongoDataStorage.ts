import { MongoClient, Collection } from 'mongodb';
import { DataStorage } from '@common/application/interfaces/dataStorage';

interface MongoData {
    key: string;
    data: string;
}

/**
 * Creates a MongoDB-based DataStorage using a collection.
 * @param client Connected MongoClient instance.
 * @param dbName Name of the database.
 * @param collectionName Name of the Mongo collection.
 */
export async function createMongoDataStorage(
    client: MongoClient,
    dbName: string,
    collectionName: string
): Promise<DataStorage> {
    const db = client.db(dbName);
    const collection: Collection<MongoData> = db.collection(collectionName);

    // Create a unique index on "key" to prevent duplicates
    await collection.createIndex({ key: 1 }, { unique: true });

    return {
        async getText(key: string) {
            const doc = await collection.findOne({ key });
            return doc ? doc.data : undefined;
        },

        async setText(key: string, data: string) {
            await collection.updateOne(
                { key },
                { $set: { data } },
                { upsert: true }
            );
        },

        async deleteItem(key: string) {
            await collection.deleteOne({ key });
        },

        async clear() {
            await collection.deleteMany({});
        },

        async getKeys() {
            const docs = await collection.find({}, { projection: { key: 1 } }).toArray();
            return docs.map(d => d.key);
        }
    };
}
