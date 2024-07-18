export class RenderState {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(states) {
    states.forEach(state => {
      this.draw(state);
    });
  }

  draw(state) {
    const { x, y, name, isFinal, isInitial } = state;

    this.ctx.beginPath();
    this.ctx.arc(x, y, 30, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#1e1e1e';
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = 'bold 16px Roboto, sans-serif';
    this.ctx.fillText(name, x, y);

    if (isFinal) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, 25, 0, 2 * Math.PI);
      this.ctx.stroke();
    }

    if (isInitial) {
      this.drawInitialArrow(x - 50, y, x - 30, y);
    }
  }

  drawInitialArrow(startX, startY, endX) {
    const angle = Math.atan2(0, endX - startX);
    const arrowHeadLength = 10;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, startY);
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(endX, startY);
    this.ctx.lineTo(endX - arrowHeadLength * Math.cos(angle - Math.PI / 6), startY - arrowHeadLength * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(endX, startY);
    this.ctx.lineTo(endX - arrowHeadLength * Math.cos(angle + Math.PI / 6), startY - arrowHeadLength * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();
  }

  getStateAtPosition(states, x, y) {
    return states.find(state => {
      const dx = x - state.x;
      const dy = y - state.y;
      return dx * dx + dy * dy <= 30 * 30;
    });
  }

  updateStatePosition(state, x, y) {
    state.x = x;
    state.y = y;
  }
}
