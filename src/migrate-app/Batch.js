class Batch extends EventTarget {
    static #previousId = -1;
    static #batchSize = 15; // ~ 15 is the recommended threshold

    id;
    isReady;

    #client;
    #timeoutId;
    #statements;

    constructor(client, statements= []) {
        super();
        this.id = ++Batch.#previousId;
        this.isReady = false;
        this.#client = client;
        this.#statements = statements;
    }

    add(statement) {
        this.#statements.push(statement);
        this.#emitReadyEventIfReady();
    }

    #emitReadyEventIfReady() {
        clearTimeout(this.#timeoutId);

        if (this.#statements.length === Batch.#batchSize) {
            this.#emitReadyEvent();
        } else {
            this.#timeoutId = setTimeout(this.#emitReadyEvent.bind(this), 20);
        }
    }

    #emitReadyEvent() {
        this.dispatchEvent(new Event('ready'));
        // console.debug(`Batch ${this.id} ready to send...`);
    }

    /**
     *
     * @returns {any}
     * @throws Error Errors should be caught upstream.
     */
    send() {
        return this.#client.batch(this.#statements, {prepare: true})
            .then(() => {
                // console.debug(`Batch ${this.id} executed successfully.`);
            });
    }
}

module.exports = Batch;