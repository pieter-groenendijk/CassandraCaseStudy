const cassandra = require('cassandra-driver');
const fs = require("fs");
const BatchHandler = require('./BatchHandler');

main();

async function main() {
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
        console.error('Error while executing main application logic', error);
    } finally {
        await client.shutdown();
        console.log('Disconnected from Cassandra.');
    }
}

async function migrate(client) {
    const timerName = 'Elapsed time';
    console.time(timerName);
    const dataFolderPath = __dirname + '/data/';

    // For now just migrate one slice
    const tempFilePath = dataFolderPath + 'mpd.slice.0-999.json';

    const batchHandler = new BatchHandler(client);
    await migrateSlice(tempFilePath, batchHandler);
    await batchHandler.waitTilDone();
    console.timeEnd(timerName);
}

async function migrateSlice(filePath, batchHandler) {
    const playlists = await readSlice(filePath);

    for (let i = 0; i < playlists.length; ++i) {
        migratePlaylist(playlists[i], batchHandler);
    }
}

function migratePlaylist(playlist, batchHandler) {
    const tracks = playlist.tracks;
    const trackURIs = new Array(tracks.length);

    for (let i = 0; i < tracks.length; ++i) {
        const track = tracks[i];
        insertTrack(track, batchHandler);
        trackURIs[i] = track['track_uri'];
    }
}

/**
 * @typedef {Object} CassandraPreparedStatement
 * @property {string} query
 * @property {string[]} params
 */

function insertTrack(track, batchHandler) {
    /**
     * @type {CassandraPreparedStatement}
     */
    const statement = {
        query:
            'insert into "Track" ("name", "URI", "artist", "durationInMs", "position", "album") values (?,?,{"name": ?,"URI": ?},?,?,{"name": ?,"URI": ?});',
        params: [
            track['track_name'],
            track['track_uri'],
            track['artist_name'],
            track['artist_uri'],
            track['duration_ms'],
            track['pos'],
            track['album_name'],
            track['album_uri']
        ]
    }

    batchHandler.addStatement(statement);
}

function insertPlaylist(playlist, trackURIs, batchHandler) {

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

            resolve(
                JSON.parse(data).playlists
            );
        });
    })
}
