import { RenderAutomaton } from '../ui/RenderAutomaton.js';
import { Canvas } from '../ui/Canvas.js';
import { DragHandler } from '../events/DragHandler.js';
import { KeyHandler } from '../events/KeyHandler.js';
import { State } from '../models/State.js';
import { Transition } from '../models/Transition.js';

export class AutomatonController {
  constructor(canvasElement, automaton) {
    this.automaton = automaton;
    this.canvas = new Canvas(canvasElement);
    this.renderer = new RenderAutomaton(this.canvas.getContext());
    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.keyHandler = new KeyHandler(this.canvas, this);
    this.dragHandler = new DragHandler(this.canvas, this, this.keyHandler);
    this.onUpdate = () => {};
    this.addEventListeners();
  }

  setUpdateCallback(callback) {
    this.onUpdate = callback;
  }

  addEventListeners() {
    this.dragHandler.addEventListeners();
    this.keyHandler.addEventListeners();
  }

  initialize() {
    this.render();
  }

  render() {
    this.canvas.clear();
    this.renderer.render(this.automaton);
  }

  generateStateName() {
    const index = this.automaton.states.length;
    const name = this.alphabet[index % 26].repeat(Math.floor(index / 26) + 1);
    return name;
  }

  addStateAtPosition(x, y) {
    const name = this.generateStateName();
    const state = new State(name, x, y);
    this.automaton.addState(state);
    this.render();
  }

  toggleInitialState(state) {
    this.automaton.toggleInitialState(state);
    this.render();
  }

  toggleFinalState(state) {
    this.automaton.toggleFinalState(state);
    this.render();
  }

  drawPreviewTransition(state, offsetX, offsetY) {
    this.render();
    this.renderer.transitionRenderer.drawPreviewTransition(state, offsetX, offsetY);
  }

  addTransition(fromState, toState, symbol) {
    const transition = new Transition(fromState, toState, symbol);
    this.automaton.addTransition(transition);
    this.render();
  }

  removeState(state) {
    this.automaton.removeState(state);
    this.render();
  }

  removeTransition(transition) {
    this.automaton.removeTransition(transition);
    this.render();
  }

  getStateAtPosition(x, y) {
    return this.renderer.stateRenderer.getStateAtPosition(this.automaton.states, x, y);
  }

  updateStatePosition(state, x, y) {
    this.renderer.stateRenderer.updateStatePosition(state, x, y);
    this.render();
  }

  getTransitionAtPosition(x, y) {
    return this.renderer.transitionRenderer.getTransitionAtPosition(this.automaton.transitions, x, y);
  }
}
