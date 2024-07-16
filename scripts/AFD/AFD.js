import { State } from './State.js';
import { Transition } from './Transition.js';

export class AFD {
    constructor(alphabet) {
        this.states = new Set();
        this.alphabet = alphabet;
        this.transitions = new Set();
        this.initial = null;
        this.final = new Set();
        this.transitionCount = new Map(); // Para contar as transições de cada estado
    }

    addState(name) {
        this.states.add(new State(name));
        this.transitionCount.set(name, 0); // Inicializa a contagem de transições do estado
    }

    removeState(name) {
      const stateToRemove = this.getState(name);
      if (stateToRemove) {
          // Remove todas as transições que envolvem o estado a ser removido
          this.transitions = new Set([...this.transitions].filter(transition =>
              !(transition.fromState === stateToRemove || transition.toState === stateToRemove)
          ));

          // Remove o estado do conjunto de estados
          this.states.delete(stateToRemove);

          // Remove do estado inicial se for o estado removido
          if (this.initial === stateToRemove) {
              this.initial = null;
          }

          // Remove do conjunto de estados finais se for um estado final removido
          this.final.delete(stateToRemove);

          // Remove do mapa de contagem de transições
          this.transitionCount.delete(name);

          console.log(`State ${name} removed`);
      } else {
          console.log(`State ${name} not found`);
      }
    }

    setInitialState(name) {
        const state = this.getState(name);
        if (state) {
            this.initial = state;
        }
    }

    addFinalState(name) {
        const state = this.getState(name);
        if (state) {
            this.final.add(state);
        }
    }

    addTransition(fromState, toState) {
        const from = this.getState(fromState);
        const to = this.getState(toState);
        const transitionIndex = this.transitionCount.get(fromState);

        if (from && to && transitionIndex < this.alphabet.length) {
            const symbol = this.alphabet[transitionIndex];
            this.transitions.add(new Transition(from, to, symbol));
            this.transitionCount.set(fromState, transitionIndex + 1);
            console.log(`Transition added from ${fromState} to ${toState} with symbol ${symbol}`, this.transitions);
        } else {
          alert(`Voce ja adicionou todas as transições do estado ${fromState}`)
          console.log(`Cannot add more transitions for ${fromState}`);
        }
    }

    removeTransition(fromState, toState) {
      this.transitions = new Set([...this.transitions].filter(transition =>
          !(transition.fromState.name === fromState && transition.toState.name === toState)
      ));
      this.transitionCount.set(fromState, 0);
    }

    getState(name) {
        for (let state of this.states) {
            if (state.name === name) {
                return state;
            }
        }
        return null;
    }

    getTransition(fromState, symbol) {
        for (let transition of this.transitions) {
            if (transition.fromState.name === fromState && transition.symbol === symbol) {
                return transition;
            }
        }
        return null;
    }
}
