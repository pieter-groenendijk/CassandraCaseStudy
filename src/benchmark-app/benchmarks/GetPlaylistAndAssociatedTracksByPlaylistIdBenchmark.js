const CassandraBenchmark = require('./CassandraBenchmark');

/**
 * @class GetPlaylistAndAssociatedTracksByPlaylistIdBenchmark
 * @augments CassandraBenchmark
 */
class GetPlaylistAndAssociatedTracksByPlaylistIdBenchmark extends CassandraBenchmark {
    constructor() {
        super(
            'GetPlaylistAndAssociatedTracksByPlaylistIdBenchmark',
            'WARNING: Retrieve all associated playlist data by specifying the playlist id. Also retrieve all track data of the tracks included in the playlist \n This would simulate an user selecting a playlist in their overview.'
        );
    }

    async executeAction(client) {
        const result = await client.execute('select * from "PlaylistTrack" where "playlistId" = ?', [7478]);
    }
}

module.exports = GetPlaylistAndAssociatedTracksByPlaylistIdBenchmark;