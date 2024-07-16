export class AddFinalStates {
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
        if (this.heldState && (event.key === 'f' || event.key === 'F')) {
            if (this.renderer.afd.final.has(this.heldState)) {
                this.renderer.afd.final.delete(this.heldState); // Remove o estado final se já estiver definido
                console.log(`State ${this.heldState.name} removed from final states`);
            } else {
                this.renderer.afd.final.add(this.heldState); // Adiciona o estado como final
                console.log(`State ${this.heldState.name} added to final states`);
            }
            this.renderer.renderAFD(this.renderer.afd); // Re-renderiza o AFD
        }
    }

    destroy() {
        this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
        document.removeEventListener('keydown', this.keyListener);
    }
}