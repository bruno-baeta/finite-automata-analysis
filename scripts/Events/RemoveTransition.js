export class RemoveTransition {
    constructor(renderer) {
        this.renderer = renderer;
        this.canvas = renderer.canvas.canvas;
        this.context = this.canvas.getContext('2d');
        this.isRPressed = false;

        this.canvas.addEventListener('click', this.onCanvasClick.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onCanvasClick(event) {
        if (!this.isRPressed) return;

        const { offsetX, offsetY } = event;
        const clickedTransition = this.getClickedTransition(offsetX, offsetY);
        if (clickedTransition) {
            this.renderer.afd.removeTransition(clickedTransition.fromState.name, clickedTransition.toState.name);
            this.renderer.renderAFD(this.renderer.afd);
            console.log(`Transition removed from ${clickedTransition.fromState.name} to ${clickedTransition.toState.name}`);
        }
    }

    getClickedTransition(offsetX, offsetY) {
        for (let transition of this.renderer.afd.transitions) {
            const start = this.renderer.statePositions.get(transition.fromState.name);
            const end = this.renderer.statePositions.get(transition.toState.name);
            const dist = this.pointToLineDistance(offsetX, offsetY, start.x, start.y, end.x, end.y);
            if (dist < 10) { // Distância de clique aceitável para a transição
                return transition;
            }
        }
        return null;
    }

    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) // in case of 0 length line
            param = dot / len_sq;

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    onKeyDown(event) {
        if (event.key.toLowerCase() === 'r') {
            this.isRPressed = true;
        }
    }

    onKeyUp(event) {
        if (event.key.toLowerCase() === 'r') {
            this.isRPressed = false;
        }
    }

    destroy() {
        this.canvas.removeEventListener('click', this.onCanvasClick.bind(this));
        document.removeEventListener('keydown', this.onKeyDown.bind(this));
        document.removeEventListener('keyup', this.onKeyUp.bind(this));
    }
}