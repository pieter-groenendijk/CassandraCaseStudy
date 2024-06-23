const GetTrackByNameBenchmark = require('./benchmarks/GetTrackByNameBenchmark');
const GetPlaylistByNameBenchmark = require('./benchmarks/GetPlaylistByNameBenchmark');
const GetPlaylistTracksByPlaylistIdBenchmark = require('./benchmarks/GetPlaylistTracksByPlaylistIdBenchmark');
const UpdatePlaylistByIdBenchmark = require('./benchmarks/UpdatePlaylistByIdBenchmark');
const DeletePlaylistByIdBenchmark = require('./benchmarks/DeletePlaylistByIdBenchmark');
const InsertPlaylistBenchmark = require('./benchmarks/InsertPlaylistBenchmark');

main();

function main() {
    runBenchmarks();
}

async function runBenchmarks(numberOfIterations = 100) {
    const benchmarks = [
        new GetTrackByNameBenchmark(),
        new GetPlaylistByNameBenchmark(),
        new GetPlaylistTracksByPlaylistIdBenchmark(),
        new UpdatePlaylistByIdBenchmark(),
        new DeletePlaylistByIdBenchmark(),
        new InsertPlaylistBenchmark(),
    ];

    console.log(`Running all benchmarks ${numberOfIterations} times.\n`);

    for (const benchmark of benchmarks) {
        await benchmark.run(numberOfIterations);
        console.log('\n'); // log 2 newlines
    }
}