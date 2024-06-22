const CassandraBenchmark = require('./CassandraBenchmark');

/**
 * @class InsertPlaylistBenchmark
 * @augments CassandraBenchmark
 */
class InsertPlaylistBenchmark extends CassandraBenchmark {
    static #playlistId = 1000001;

    constructor() {
        super(
            'InsertPlaylistBenchmark',
            'Inserts a playlist.'
        );
    }

    async executeAction(client) {
        // Insert an updatable record for the benchmark
        await client.execute(
            `insert into "Playlist" ("id", "name", "description", "isCollaborative", "modifiedAt", "numberOfTracks", "numberOfAlbums", "numberOfFollowers") values (?, ?, ?, ?, toTimestamp(now()), ?, ?, ?);`,
            [
                InsertPlaylistBenchmark.#playlistId,
                'A beautiful name',
                'A elaborate description',
                false,
                144,
                117,
                1
            ],
            {
                prepare: true
            }
        );
    }

    async cleanup(client) {
        await client.execute(
            `delete from "Playlist" where "id" = ?;`,
            [
                InsertPlaylistBenchmark.#playlistId
            ],
            {
                prepare: true
            }
        );
    }

    prepare(client) {
    }
}

module.exports = InsertPlaylistBenchmark;