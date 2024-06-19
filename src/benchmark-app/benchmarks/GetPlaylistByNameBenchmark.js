const CassandraBenchmark = require('./CassandraBenchmark');

/**
 * @class GetPlaylistByNameBenchmark
 * @augments CassandraBenchmark
 */
class GetPlaylistByNameBenchmark extends CassandraBenchmark {
    constructor() {
        super(
            'GetPlaylistByName',
            'Retrieve all associated playlist data by specifying a name.'
        );
    }

    async executeAction(client) {
        await client.execute('select * from "Playlist" where "name" = ?;', ['take.it.back.']);
    }
}

module.exports = GetPlaylistByNameBenchmark;