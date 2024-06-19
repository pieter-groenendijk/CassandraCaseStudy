const Queue = require('./Queue');
const Batch = require('./Batch');

/**
 * Class automatically sends added statements into batches to hopefully spare you some network usage.
 */
class BatchHandler extends EventTarget {
    #client;
    #maxConcurrentBatches;
    /**
     * An array containing prepared statements for a batch that hasn't been sent yet.
     * @type {Batch}
     */
    #currentBatch;
    /**
     * @type {Map}
     */
    #unsettledBatches;
    #batchQueue;

    constructor(client, maxConcurrentBatches = 75) {
        super();
        this.#client = client;
        this.#maxConcurrentBatches = maxConcurrentBatches;

        this.#resetCurrentBatch();

        this.#unsettledBatches = new Map();
        this.#batchQueue = new Queue();
    }

    #dequeueBatch() {
        const maybeBatch = this.#batchQueue.dequeue();

        if (maybeBatch) {
            this.#sendBatch(maybeBatch);
            // console.debug(`Sent queued batch ${maybeBatch.id}.`);
        }
    }

    #queueBatch(batch) {
        this.#batchQueue.enqueue(batch);
        // console.debug(`Queued batch ${batch.id}.`);
    }

    /**
     * Adds given statement to the current batch. Automatically sends the batch if
     *  - It reaches the configured batchSize
     *  - It passes the configured addStatementTimeout without having a statement added in the meantime.
     * @param {CassandraPreparedStatement} statement
     */
    addStatement(statement) {
        this.#currentBatch.add(statement);
    }

    #resetCurrentBatch() {
        this.#currentBatch = new Batch(this.#client);

        const currentBatch = this.#currentBatch;

        currentBatch.addEventListener('ready', () => {
            this.#resetCurrentBatch();

            if (this.#unsettledBatches.size > this.#maxConcurrentBatches) {
                this.#queueBatch(currentBatch);
                return;
            }

            this.#sendBatch(currentBatch);
        });
    }

    #sendBatch(batch) {
        this.#unsettledBatches.set(
            batch.id,
            batch.send()
                .catch((error) => {
                    console.error(`Error while executing batch ${batch.id}: `, error, error.info);

                    setTimeout(() => { // Since this is not a production tool this is fine for now
                        this.#queueBatch(batch);
                    }, 500);
                })
                .finally(() => {
                    this.#unsettledBatches.delete(batch.id);
                    this.#dequeueBatch();
                    this.#stopIfDone();
                })
        );
    }

    async waitTilDone() {
        await new Promise((resolve) => {
            this.addEventListener('done', resolve);
        });
    }

    abort() {
        // Remove queued batches that haven't been sent yet.
        this.#batchQueue = new Queue();
        this.abort = this.addStatement = () => {};

        this.#emitAbortEvent();
    }

    #stopIfDone() {
        if (this.#unsettledBatches.size !== 0) return;

        this.#emitDoneEvent();
    }

    #emitAbortEvent() {
        this.dispatchEvent(new Event('abort'));
    }

    #emitDoneEvent() {
        this.dispatchEvent(new Event('done'));
    }
}


module.exports = BatchHandler