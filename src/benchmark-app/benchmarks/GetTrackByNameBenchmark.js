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
        await client.execute('select * from "Track" where "name" = ?;', ['You Wear Those Eyes']);
    }
}

module.exports = GetTrackByNameBenchmark;