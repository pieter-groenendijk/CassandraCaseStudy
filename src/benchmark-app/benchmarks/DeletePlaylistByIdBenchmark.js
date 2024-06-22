const CassandraBenchmark = require('./CassandraBenchmark');

/**
 * @class DeletePlaylistByIdBenchmark
 * @augments CassandraBenchmark
 */
class DeletePlaylistByIdBenchmark extends CassandraBenchmark {
    static #playlistId = 1000001;

    constructor() {
        super(
            'DeletePlaylistByIdBenchmark',
            'Deletes a playlist by specifying an id.'
        );
    }

    async executeAction(client) {
        await client.execute(
            `delete from "Playlist" where "id" = ?;`,
            [
                DeletePlaylistByIdBenchmark.#playlistId
            ],
            {
                prepare: true
            }
        );
    }

    async cleanup(client) {

    }

    async prepare(client) {
        // Insert an updatable record for the benchmark
        await client.execute(
            `insert into "Playlist" ("id", "name", "description", "isCollaborative", "modifiedAt", "numberOfTracks", "numberOfAlbums", "numberOfFollowers") values (?, ?, ?, ?, toTimestamp(now()), ?, ?, ?);`,
            [
                DeletePlaylistByIdBenchmark.#playlistId,
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

module.exports = DeletePlaylistByIdBenchmark;