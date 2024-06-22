const CassandraBenchmark = require('./CassandraBenchmark');

/**
 * @class UpdatePlaylistByIdBenchmark
 * @augments CassandraBenchmark
 */
class UpdatePlaylistByIdBenchmark extends CassandraBenchmark {
    static #playlistId = 1000001;

    constructor() {
        super(
            'UpdatePlaylistByIdBenchmark',
            'Updates a playlist by specifying an id.'
        );
    }

    async executeAction(client) {
        await client.execute(
            `update "Playlist" set "numberOfFollowers" = 2 where "id" = ?;`,
            [
                UpdatePlaylistByIdBenchmark.#playlistId
            ]
        );
    }

    async cleanup(client) {
        await client.execute(
            `delete from "Playlist" where "id" = ?;`,
            [
                UpdatePlaylistByIdBenchmark.#playlistId
            ],
            {
                prepare: true
            }
        );
    }

    async prepare(client) {
        // Insert an updatable record for the benchmark
        await client.execute(
            `insert into "Playlist" ("id", "name", "description", "isCollaborative", "modifiedAt", "numberOfTracks", "numberOfAlbums", "numberOfFollowers") values (?, ?, ?, ?, toTimestamp(now()), ?, ?, ?);`,
            [
                UpdatePlaylistByIdBenchmark.#playlistId,
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
}

module.exports = UpdatePlaylistByIdBenchmark;