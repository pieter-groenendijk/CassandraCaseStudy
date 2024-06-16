const cassandra = require('cassandra-driver');


const client = new cassandra.Client({
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1',
    keyspace: 'SpotifyPlaylists',
});

async function main(callback) {
    await client.connect(); // no try catch since application is reliant on it to work.
    console.log('Connected to Cassandra.');

    try {
        await callback();
    } catch (error) {
        console.error('Error while executing main application logic');
        console.error(error);
    } finally {
        await client.shutdown();
        console.log('Disconnected from Cassandra.');
    }
}

main(() => {
    console.log('application code');
});
