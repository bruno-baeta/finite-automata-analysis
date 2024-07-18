import { RenderState } from './RenderState.js';
import { RenderTransition } from './RenderTransition.js';

export class RenderAutomaton {
  constructor(ctx) {
    this.ctx = ctx;
    this.stateRenderer = new RenderState(ctx);
    this.transitionRenderer = new RenderTransition(ctx);
  }

  render(automaton) {
    this.stateRenderer.render(automaton.states);
    this.transitionRenderer.render(automaton.transitions);
  }
}
