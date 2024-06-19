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

    /**
     * @override
     */
    executeAction() {

    }
}