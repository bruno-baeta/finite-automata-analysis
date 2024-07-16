export class RemoveState {
    constructor(renderer, afd) {
        this.renderer = renderer;
        this.afd = afd;
        this.canvas = renderer.canvas.canvas;
        this.keyListener = this.onKeyDown.bind(this);

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('keydown', this.keyListener);
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onMouseDown(event) {
        const { offsetX, offsetY } = event;
        const clickedState = this.renderer.getStateAtPosition(offsetX, offsetY);

        if (clickedState && this.isRKeyPressed) {
            this.afd.removeState(clickedState.name);
            console.log(`State ${clickedState.name} removed.`);
            this.renderer.renderAFD(this.afd); 
        }
    }

    onKeyDown(event) {
        if (event.key === 'r' || event.key === 'R') {
            this.isRKeyPressed = true;
        }
    }

    onKeyUp(event) {
        if (event.key === 'r' || event.key === 'R') {
            this.isRKeyPressed = false;
        }
    }

    destroy() {
        this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
        document.removeEventListener('keydown', this.keyListener);
        document.removeEventListener('keyup', this.onKeyUp.bind(this));
    }
}