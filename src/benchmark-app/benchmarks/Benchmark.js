const { performance } = require('node:perf_hooks');

/**
 * Extend this class to create a runnable benchmark
 * @class Benchmark
 * @abstract
 */
class Benchmark {
    #name;
    #description;
    constructor(name = 'Benchmark', description = '') {
        this.#name = name;
        this.#description = description;
    }

    /**
     * Runs the benchmark the specified amount of times. The results are logged into the console.
     */
    run(numberOfIterations = 50) {
        const elapsedTimes = new Array(numberOfIterations);
        try {
            for (let i = 0; i < numberOfIterations; ++i) {

            }
        } catch (error) {
            this.#showError(error);
        }
    }

    /**
     * Runs one iteration of the benchmark
     *
     * @returns {number} Returns the elapsed time in ms.
     */
    #runOne() {
        const startTime = performance.now();

        this.executeAction();

        return performance.now() - startTime; // elapsed time
    }

    /**
     * This function contains the actual content that needs to be benchmarked.
     *
     * This function needs to be implemented by the child class.
     * @method Benchmark.executeAction
     * @protected
     * @abstract
     */

    /**
     * Logs statistics based of the performed benchmark
     * @param {number[]} iterations
     */
    #showResults(iterations) {
        const statistics = this.#calculateStatistics(iterations);

        this.#log(() => {
            for(const [key, value] of Object.entries(statistics)) {
                console.log(`${key}: ${value}ms`);
            }
        });
    }

    /**
     * Log an error that occurred while performing the benchmark
     * @param error
     */
    #showError(error) {
        this.#log(() => {
            console.log('Failed while testing: ', error);
        });
    }

    /**
     * Logs the standard benchmark info and uses the passed function with the purpose to log the content
     * @param logContent
     */
    #log(logContent) {
        this.#beginLog();
        logContent();
        this.#endLog();
    }

    #beginLog() {
        console.log("--------------------------------------");
        console.log(`Benchmark: ${this.#name}`);
        console.log(`Description: ${this.#description}`);
        console.log('\n');
    }

    #endLog() {
        console.log("--------------------------------------");
    }

    /**
     * @typedef {Object} BenchmarkStatistics
     * @property {number} totalElapsedTime
     * @property {number} averageElapsedTime
     * @property {number} lowestElapsedTime
     * @property {number} highestElapsedTime
     */

    /**
     * Calculate (and return) statistics based of passed iteration times
     * @param {number[]} iterations
     * @returns {BenchmarkStatistics}
     */
    #calculateStatistics(iterations) {
        const firstIteration = iterations[0];

        /**
         * @type {BenchmarkStatistics}
         */
        const statistics = {
            totalElapsedTime: firstIteration,
            averageElapsedTime: firstIteration,
            lowestElapsedTime: firstIteration,
            highestElapsedTime: firstIteration
        };

        for (let i = 1; i < iterations.length; ++i) {
            const iteration = iterations[i];

            statistics.totalElapsedTime += iteration;

            if (iteration < statistics.lowestElapsedTime) {
                statistics.lowestElapsedTime = iteration;
            } else if (iteration > statistics.highestElapsedTime) {
                statistics.highestElapsedTime = iteration;
            }
        }

        // Calculate average
        statistics.averageElapsedTime = statistics.totalElapsedTime / iterations.length;

        return statistics;
    }
}

module.exports = Benchmark;