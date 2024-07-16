export class StateMover {
    constructor(renderer) {
        this.renderer = renderer;
        this.canvas = renderer.canvas.canvas;
        this.isDragging = false;
        this.draggedState = null;
        this.isShiftPressed = false;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    onMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const state = this.renderer.getStateAtPosition(offsetX, offsetY);
        if (state) {
            this.isDragging = true;
            this.draggedState = state;
            console.log('Mouse Down:', state.name);
        }
    }

    onMouseMove(event) {
        if (this.isDragging && !this.isShiftPressed) {
            const rect = this.canvas.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            this.renderer.updateStatePosition(this.draggedState, offsetX, offsetY);
            console.log('Mouse Move:', this.draggedState.name, 'to', offsetX, offsetY);
        }
    }

    onMouseUp() {
        if (this.isDragging) {
            console.log('Mouse Up:', this.draggedState.name);
            this.isDragging = false;
            this.draggedState = null;
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

    destroy() {
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
    }
}