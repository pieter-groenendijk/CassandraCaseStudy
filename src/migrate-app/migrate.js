const BatchHandler = require("./BatchHandler");
const fs = require("fs");

async function migrate(client) {
    const timerName = 'Elapsed time';
    console.time(timerName);

    // For now just migrate one slice

    const batchHandler = new BatchHandler(client);
    await migrateSlices(client, batchHandler);


    // await batchHandler.waitTilDone();
    console.timeEnd(timerName);
}

async function migrateSlices(client, batchHandler) {
    return new Promise(async (resolve, reject) => {
        const dataFolderPath = __dirname + '/data/';

        const directoryStream = await fs.promises.opendir(dataFolderPath);
        let sliceCounter = 0;
        for await (const directoryEntry of directoryStream) {
            ++sliceCounter;
            const sliceTimerLabel = `Slice ${sliceCounter} Elapsed Time`;
            console.time(sliceTimerLabel);
            await migrateSlice(`${dataFolderPath}${directoryEntry.name}`, batchHandler); // It's counterintuitive but the application is faster if we wait for the previous slice to be completely read.
            console.timeEnd(sliceTimerLabel);
        }
    });
}

function migrateSlice(filePath, batchHandler) {
    return new Promise(async (resolve, reject) => {
        async function abort() {
            console.info('Aborted Slice');
            await batchHandler.waitTilDone();
            reject();
        }
        batchHandler.addEventListener('abort', abort);

        function done() {
            batchHandler.removeEventListener('abort', abort);
            batchHandler.removeEventListener('done', done);
            resolve();
        }
        batchHandler.addEventListener('done', done);

        const playlists = await readSlice(filePath);

        for (let i = 0; i < playlists.length; ++i) {
            migratePlaylist(playlists[i], batchHandler);
        }
    });
}

function migratePlaylist(playlist, batchHandler) {
    const tracks = playlist.tracks;
    const playlistTrackMap = {};

    for (let i = 0; i < tracks.length; ++i) {
        const track = tracks[i];
        insertTrack(track, batchHandler);
        playlistTrackMap[track['pos']] = track['track_uri'];
    }

    insertPlaylist(playlist, playlistTrackMap, batchHandler);
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
            'insert into "Track" ("name", "URI", "artist", "durationInMs", "album") values (?,?,{"name": ?,"URI": ?},?,{"name": ?,"URI": ?});',
        params: [
            track['track_name'],
            track['track_uri'],
            track['artist_name'],
            track['artist_uri'],
            track['duration_ms'],
            track['album_name'],
            track['album_uri']
        ]
    };

    batchHandler.addStatement(statement);
}

function insertPlaylist(playlist, trackMap, batchHandler) {
    const statement = {
        query:
            'insert into "Playlist" ("id", "name", "description", "isCollaborative", "modifiedAt", "tracks", "durationInMs", "numberOfArtists", "numberOfAlbums", "numberOfTracks", "numberOfFollowers", "numberOfEdits") values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        params: [
            playlist['pid'],
            playlist['name'],
            playlist['description'],
            playlist['collaborative'],
            playlist['modified_at'],
            trackMap,
            playlist['duration_ms'],
            playlist['num_artists'],
            playlist['num_albums'],
            playlist['num_tracks'],
            playlist['num_followers'],
            playlist['num_edits']
        ]
    };

    batchHandler.addStatement(statement);
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
    })
}

module.exports = {
    migrate
}