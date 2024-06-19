const Benchmark = require('./Benchmark');
const cassandra = require('cassandra-driver');

/**
 * @class CassandraBenchmark
 * @abstract
 */
class CassandraBenchmark extends Benchmark {
    constructor(name, description) {
        super(name, description);
    }

    async run(numberOfIterations = 50) {
        const client = new cassandra.Client({
            contactPoints: ['localhost'],
            localDataCenter: 'datacenter1',
            keyspace: 'SpotifyPlaylists',
        });
        await client.connect();

        await super.run(numberOfIterations, client);

        await client.shutdown();
    }

    /**
     * @method CassandraBenchmark.executionAction
     * @param {Client} client
     * @abstract
     */
}

module.exports = CassandraBenchmark;