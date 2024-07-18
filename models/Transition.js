export class Transition {
    constructor(fromState, toState, symbol) {
        this.fromState = fromState;
        this.toState = toState;
        this.symbol = symbol;
    }

    isBidirectional(transctions) {
        return transctions.some( transaction => 
            this.fromState.name === transaction.toState.name && 
            this.toState.name === transaction.fromState.name
        );
    }
}
