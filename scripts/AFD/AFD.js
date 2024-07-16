import { State } from './State.js';
import { Transition } from './Transition.js';

export class AFD {
    constructor() {
      this.states = new Set();
      this.alphabet = new Set();
      this.transitions = new Set();
      this.initial = null;
      this.final = new Set();
    }
  
    addState(name) {
      this.states.add(new State(name));
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
  
    addTransition(fromState, toState, symbol) {
      const from = this.getState(fromState);
      const to = this.getState(toState);
      if (from && to) {
        this.alphabet.add(symbol);
        this.transitions.add(new Transition(from, to, symbol));
      }
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