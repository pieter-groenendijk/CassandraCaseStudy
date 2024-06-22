const GetTrackByNameBenchmark = require('./benchmarks/GetTrackByNameBenchmark');
const GetPlaylistByNameBenchmark = require('./benchmarks/GetPlaylistByNameBenchmark');
const GetPlaylistTracksByPlaylistIdBenchmark = require('./benchmarks/GetPlaylistTracksByPlaylistIdBenchmark');
const UpdatePlaylistByIdBenchmark = require('./benchmarks/UpdatePlaylistByIdBenchmark');

main();

function main() {
    runBenchmarks();
}

async function runBenchmarks(numberOfIterations = 10000) {
    const benchmarks = [
        new GetTrackByNameBenchmark(),
        new GetPlaylistByNameBenchmark(),
        new GetPlaylistTracksByPlaylistIdBenchmark(),
        new UpdatePlaylistByIdBenchmark(),
    ];

    console.log(`Running all benchmarks ${numberOfIterations} times.\n`);

    for (const benchmark of benchmarks) {
        await benchmark.run(numberOfIterations);
        console.log('\n'); // log 2 newlines
    }
}