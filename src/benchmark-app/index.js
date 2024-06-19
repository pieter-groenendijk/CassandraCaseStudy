const GetTrackByNameBenchmark = require('./benchmarks/GetTrackByNameBenchmark');

main();

function main() {
    runBenchmarks();
}

async function runBenchmarks(numberOfIterations = 1000) {
    const benchmarks = [
        new GetTrackByNameBenchmark(),

    ];

    for (const benchmark of benchmarks) {
        await benchmark.run(numberOfIterations);
    }
}