const cassandra = require('cassandra-driver');
const fs = require("fs");

main((client) => {
    const dataFolderPath = __dirname + '/data/';
    // For now just migrate one slice

    const tempFilePath = dataFolderPath + 'mpd.slice.0-999.json';

    migrateSlice(tempFilePath);
});

async function main(migrate) {
    const client = new cassandra.Client({
        contactPoints: ['localhost'],
        localDataCenter: 'datacenter1',
        keyspace: 'SpotifyPlaylists',
    });
    await client.connect(); // no try catch since application is reliant on it to work.
    console.log('Connected to Cassandra.');

    try {
        await migrate(client);
    } catch (error) {
        console.error('Error while executing main application logic');
        console.error(error);
    } finally {
        await client.shutdown();
        console.log('Disconnected from Cassandra.');
    }
}

/**
 * @returns {Promise<void>}
 */
async function migrateSlice(filePath) {
    const playlists = await readSlice(filePath);

    console.log(playlists);
}

/**
 * Currently this reads and parses a whole json slice. Maybe use a stream in the future.
 *
 * @param {String} filePath
 * @returns {Promise<Object>}
 * @throws {Error} If there was an error while reading or parsing the file.
 */
function readSlice(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) reject(error);

            resolve(data);
        });
    }).then((data) => {
        return JSON.parse(data).playlists;
    });
}
