const Benchmark = require('./Benchmark');
const { Client } = require('cassandra-driver');

/**
 * @class CassandraBenchmark
 * @abstract
 */
class CassandraBenchmark extends Benchmark {
    constructor(name, description) {
        super(name, description);
    }

    async run(numberOfIterations = 50, ...actionArguments) {
        const client = new Client({
            contactPoints: ['localhost'],
            localDataCenter: 'datacenter1',
            keyspace: 'SpotifyPlaylists',
        });
        await client.connect();

        super.run(numberOfIterations, [client, ...actionArguments]);

        await client.shutdown();
    }
}

module.exports = CassandraBenchmark;