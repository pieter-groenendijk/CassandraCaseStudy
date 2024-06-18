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

    peek() {
        return this.#elements[0];
    }

    size() {
        return this.#elements.length;
    }
}

module.exports = Queue;