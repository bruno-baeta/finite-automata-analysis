export class Canvas {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.context = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const { width, height } = this.canvas.parentNode.getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getContext() {
        return this.context;
    }
}