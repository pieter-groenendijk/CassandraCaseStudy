const CassandraBenchmark = require('./CassandraBenchmark');

/**
 * @class GetTrackByNameBenchmark
 * @augments CassandraBenchmark
 */
class GetTrackByNameBenchmark extends CassandraBenchmark {
    constructor() {
        super(
            'GetTrackByName',
            'Retrieve all associated track data by specifying a name.'
        );
    }

    async executeAction(client) {
        await client.execute('select "URI" from "Track" where "name" = ?;', ['All The Feels']);
    }
}

module.exports = GetTrackByNameBenchmark;