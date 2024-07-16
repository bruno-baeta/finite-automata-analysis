export class LinkTransition {
    constructor(renderer) {
        this.renderer = renderer;
        this.canvas = renderer.canvas.canvas;
        this.context = this.canvas.getContext('2d');
        this.startState = null;
        this.endState = null;
        this.currentPosition = null;
        this.isShiftPressed = false;
        this.isDrawing = false;
        this.keyListener = this.onKeyDown.bind(this);

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('keydown', this.keyListener);
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onMouseDown(event) {
        if (!this.isShiftPressed) return;

        const { offsetX, offsetY } = event;
        this.startState = this.renderer.getStateAtPosition(offsetX, offsetY);
        
        if (!this.startState) return;  // Verifica se o clique foi em um estado

        this.currentPosition = { x: offsetX, y: offsetY };
        this.isDrawing = true;
    }

    onMouseMove(event) {
        if (this.isDrawing && this.isShiftPressed) {
            const { offsetX, offsetY } = event;
            this.currentPosition = { x: offsetX, y: offsetY };
            this.renderer.renderAFD(this.renderer.afd);
            this.drawLine(this.startState, this.currentPosition);
        }
    }

    onMouseUp(event) {
        if (this.isDrawing && this.isShiftPressed) {
            const { offsetX, offsetY } = event;
            this.endState = this.renderer.getStateAtPosition(offsetX, offsetY);

            // Se o estado final for nulo, significa que soltamos o clique sobre nenhum estado específico,
            // então configuramos this.endState para this.startState para fazer uma transição para si mesmo.
            if (!this.endState) {
                this.endState = this.startState;
            }

            this.addTransitionIfValid();
            this.currentPosition = null;
            this.startState = null;
            this.endState = null;
            this.isDrawing = false;
        }
    }

    addTransitionIfValid() {
        if (this.startState && this.endState) {
            const symbol = this.renderer.afd.alphabet.values().next().value; // Pega o primeiro símbolo do alfabeto
            this.renderer.afd.addTransition(this.startState.name, this.endState.name, symbol);
            console.log(`Transition added from ${this.startState.name} to ${this.endState.name} with symbol ${symbol}`);
            this.renderer.renderAFD(this.renderer.afd); // Re-renderiza o AFD após adicionar a transição
        }
    }

    onKeyDown(event) {
        if (event.key === 'Shift') {
            this.isShiftPressed = true;
        }
    }

    onKeyUp(event) {
        if (event.key === 'Shift') {
            this.isShiftPressed = false;
        }
    }

    drawLine(startState, currentPosition) {
        const context = this.context;
        const { x: startX, y: startY } = this.renderer.statePositions.get(startState.name);

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.strokeStyle = '#ffffff';
        context.lineWidth = 2;
        context.stroke();
    }

    destroy() {
        this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
        document.removeEventListener('keydown', this.keyListener);
        document.removeEventListener('keyup', this.onKeyUp.bind(this));
    }
}