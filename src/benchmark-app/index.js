const GetTrackByNameBenchmark = require('./benchmarks/GetTrackByNameBenchmark');
const GetPlaylistByNameBecnmark = require('./benchmarks/GetPlaylistByNameBenchmark');

main();

function main() {
    runBenchmarks();
}

async function runBenchmarks(numberOfIterations = 1000) {
    const benchmarks = [
        new GetTrackByNameBenchmark(),
        new GetPlaylistByNameBecnmark()
    ];

    console.log(`Running all benchmarks ${numberOfIterations} times.\n`);

    for (const benchmark of benchmarks) {
        await benchmark.run(numberOfIterations);
        console.log('\n'); // log 2 newlines
    }
}