export class SetInitialState {
    constructor(renderer) {
        this.renderer = renderer;
        this.canvas = renderer.canvas.canvas;
        this.heldState = null;
        this.keyListener = this.onKeyDown.bind(this);

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('keydown', this.keyListener);
    }

    onMouseDown(event) {
        const { offsetX, offsetY } = event;
        this.heldState = this.renderer.getStateAtPosition(offsetX, offsetY);
    }

    onMouseUp() {
        this.heldState = null;
    }

    onKeyDown(event) {
        if (this.heldState && (event.key === 'i' || event.key === 'I')) {
            if (this.renderer.afd.initial === this.heldState) {
                this.renderer.afd.initial = null;
                console.log(`State ${this.heldState.name} unset as initial`);
            } else {
                const currentInitial = this.renderer.afd.initial;
                if (currentInitial) {
                    this.renderer.afd.initial = null; 
                }
                this.renderer.afd.setInitialState(this.heldState.name);
                console.log(`State ${this.heldState.name} set as initial`);
            }
            this.renderer.renderAFD(this.renderer.afd); 
        }
    }

    destroy() {
        this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
        document.removeEventListener('keydown', this.keyListener);
    }
}