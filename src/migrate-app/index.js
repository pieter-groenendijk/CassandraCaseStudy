const cassandra = require('cassandra-driver');
const { migrate } = require('./migrate');

main();

async function main() {
    const client = new cassandra.Client({
        contactPoints: ['localhost'],
        localDataCenter: 'datacenter1',
        keyspace: 'SpotifyPlaylists',
    });

    await client.connect(); // no try catch since application is reliant on it to work.
    console.info('Connected to Cassandra.');

    try {
        await migrate(client);
    } catch (error) {
        console.error('Error while executing main application logic', error);
    } finally {
        await client.shutdown();
        console.info('Disconnected from Cassandra.');
    }
}


