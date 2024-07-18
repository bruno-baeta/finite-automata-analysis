export class DragHandler {
  constructor(canvas, controller, keyHandler) {
    this.canvas = canvas;
    this.controller = controller;
    this.keyHandler = keyHandler;
    this.draggingState = null;
    this.creatingTransition = false;
    this.targetState = null;
    this.symbolKeyboard = document.getElementById('symbolKeyboard');
    this.symbolsContainer = document.getElementById('symbolsContainer');
  }

  addEventListeners() {
    this.canvas.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseDown(event) {
    const { offsetX, offsetY } = event;
    this.draggingState = this.getStateAtPosition(offsetX, offsetY);
    this.controller.selectedState = this.draggingState;

    if (this.shouldStartCreatingTransition(event)) {
      this.startCreatingTransition();
    } else if (this.shouldAddState(event)) {
      this.addStateAtPosition(offsetX, offsetY);
    } else {
      this.handleMouseDownOnStateOrTransition();
    }
  }

  onMouseMove(event) {
    if (!this.draggingState) return;
    const { offsetX, offsetY } = event;

    if (this.creatingTransition) {
      this.previewTransition(offsetX, offsetY);
    } else {
      this.moveState(offsetX, offsetY);
    }
  }

  onMouseUp(event) {
    if (this.creatingTransition) {
      this.fixTargetState(event);
      this.showSymbolKeyboard();
    } else {
      this.resetDraggingState();
    }
  }

  shouldStartCreatingTransition(event) {
    return this.draggingState && event.shiftKey;
  }

  shouldAddState() {
    return !this.draggingState && !this.keyHandler.isAnyKeyPressed();
  }

  startCreatingTransition() {
    this.creatingTransition = true;
    this.targetState = null;
  }

  addStateAtPosition(offsetX, offsetY) {
    this.controller.addStateAtPosition(offsetX, offsetY);
  }

  handleMouseDownOnStateOrTransition() {
    if (this.shouldHandleState()) {
      this.keyHandler.handleStateClick(this.draggingState);
    }
  }

  shouldHandleState() {
    return !!this.draggingState;
  }

  previewTransition(offsetX, offsetY) {
    if (!this.symbolKeyboard.classList.contains('hidden')) {
      this.controller.drawPreviewTransition(
        this.draggingState,
        this.targetState.x,
        this.targetState.y
      );
    } else {
      this.targetState = this.getStateAtPosition(offsetX, offsetY) || this.targetState || this.draggingState;
      this.controller.drawPreviewTransition(this.draggingState, offsetX, offsetY);
    }
  }

  fixTargetState(event) {
    const { offsetX, offsetY } = event;
    this.targetState = this.getStateAtPosition(offsetX, offsetY) || this.draggingState;
  }

  moveState(offsetX, offsetY) {
    this.controller.updateStatePosition(this.draggingState, offsetX, offsetY);
  }

  showSymbolKeyboard() {
    this.symbolKeyboard.classList.remove('hidden');
    this.symbolsContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    this.controller.automaton.alphabet.forEach(symbol => {
      const button = createSymbolButton(symbol, () => this.finalizeTransition(symbol));
      fragment.appendChild(button);
    });

    this.symbolsContainer.appendChild(fragment);
  }

  finalizeTransition(symbol) {
    if (this.isValidTransition(symbol)) {
      this.controller.addTransition(this.draggingState, this.targetState, symbol);
      this.symbolKeyboard.classList.add('hidden');
      this.resetDraggingState();
    } else {
      console.log(`Invalid symbol. Symbol must be one of: ${this.controller.automaton.alphabet.join(', ')}`);
      this.symbolKeyboard.classList.add('hidden');
      this.resetDraggingState();
    }
  }

  isValidTransition(symbol) {
    return this.draggingState && this.targetState && this.controller.automaton.alphabet.includes(symbol);
  }

  resetDraggingState() {
    this.draggingState = null;
    this.creatingTransition = false;
    this.targetState = null;
  }

  getStateAtPosition(offsetX, offsetY) {
    return this.controller.getStateAtPosition(offsetX, offsetY);
  }

  getTransitionAtPosition(offsetX, offsetY) {
    return this.controller.getTransitionAtPosition(offsetX, offsetY);
  }
}

function createSymbolButton(symbol, onClick) {
  const button = document.createElement('button');
  button.className = 'symbol-button';
  button.textContent = symbol;
  button.addEventListener('click', onClick);
  return button;
}
