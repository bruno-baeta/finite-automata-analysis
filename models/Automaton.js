export class Automaton {
    constructor() {
        this.states = [];
        this.alphabet = ['λ', '0', '1'];
        this.transitions = [];
        this.initial = [];
        this.final = [];
    }

    /*
    *   SETTERS
    */

    setAlphabet(alphabet) {
        this.alphabet = alphabet;
    }

    addState(state) {
        this.states.push(state);
        console.log('added state: ', state)
    }

    toggleInitialState(state) {
        const index = this.initial.indexOf(state);
        const isInitial = index !== -1;

        if (isInitial) {
            this.initial.splice(index, 1);
            state.isInitial = false;
        } else {
            this.initial.push(state);
            state.isInitial = true;
        }
    }

    toggleFinalState(state) {
        const index = this.final.indexOf(state);
        const isFinal = index !== -1;

        state.isFinal = !isFinal;
        if (isFinal) {
            this.final.splice(index, 1);
        } else {
            this.final.push(state);
        }
    }

    addTransition(transition) {
        this.transitions.push(transition);
    }

    /*
    *   GETTERS
    */

    getAlphabet() {
        return this.alphabet;
    }

    getInitialState() {
        return this.initial;
    }

    getFinalState() {
        return this.final;
    }

    getStateByName(name) {
        return this.states.find(state => state.name == name)
    }

    /*
    *   REMOVES
    */

    removeTransition(transitionToRemove) {
        this.transitions = this.transitions.map(
            transition => transition !== transitionToRemove
        )
    }

    clearAlphabet() {
        this.alphabet = []
    }

    clearFinalStates() {
        this.final = []
    }

    removeState(stateToRemove) {
        this.states = this.states.filter(state =>
            state !== stateToRemove
        )
        this.transitions = this.transitions.filter(transition =>
            transition.fromState.name !== stateToRemove.name &&
            transition.toState.name !== stateToRemove.name
        );
    }
}
