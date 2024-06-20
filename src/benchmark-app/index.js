const GetTrackByNameBenchmark = require('./benchmarks/GetTrackByNameBenchmark');
const GetPlaylistByNameBenchmark = require('./benchmarks/GetPlaylistByNameBenchmark');
const GetPlaylistTracksByPlaylistIdBenchmark = require('./benchmarks/GetPlaylistTracksByPlaylistIdBenchmark');

main();

function main() {
    runBenchmarks();
}

async function runBenchmarks(numberOfIterations = 1) {
    const benchmarks = [
        new GetTrackByNameBenchmark(),
        new GetPlaylistByNameBenchmark(),
        new GetPlaylistTracksByPlaylistIdBenchmark()
    ];

    console.log(`Running all benchmarks ${numberOfIterations} times.\n`);

    for (const benchmark of benchmarks) {
        await benchmark.run(numberOfIterations);
        console.log('\n'); // log 2 newlines
    }
}