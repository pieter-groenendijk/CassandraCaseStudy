const cassandra = require('cassandra-driver');

async function main(migrate) {
    const client = new cassandra.Client({
        contactPoints: ['localhost'],
        localDataCenter: 'datacenter1',
        keyspace: 'SpotifyPlaylists',
    });
    await client.connect(); // no try catch since application is reliant on it to work.
    console.log('Connected to Cassandra.');

    try {
        await migrate(client);
    } catch (error) {
        console.error('Error while executing main application logic');
        console.error(error);
    } finally {
        await client.shutdown();
        console.log('Disconnected from Cassandra.');
    }
}

main((client) => {

});
