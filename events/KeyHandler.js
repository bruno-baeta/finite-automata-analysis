export class KeyHandler {
  constructor(canvas, controller) {
    this.canvas = canvas;
    this.controller = controller;
    this.pressedKey = null;
  }

  addEventListeners() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  isAnyKeyPressed() {
    return this.pressedKey !== null;
  }

  handleStateClick(state) {
    if (!state) return;
    this.executeStateAction(state);
  }

  onKeyDown(event) {
    this.pressedKey = event.key.toLowerCase();
  }

  onKeyUp() {
    this.pressedKey = null;
  }

  executeStateAction(state) {
    switch(this.pressedKey) {
      case 'i':
        this.controller.toggleInitialState(state);
        break;
        
      case 'f':
        this.controller.toggleFinalState(state);
        break;

      case 'r':
        this.controller.removeState(state);
        break;

      default:
        break;
    }
  }
}
