class Queue {
    #elements;
    constructor() {
        this.#elements = [];
    }

    enqueue(element) {
        this.#elements.push(element);
    }

    dequeue() {
        return this.#elements.shift();
    }
}

module.exports = Queue;