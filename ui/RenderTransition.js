export class RenderTransition {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(transitions) {
    const transitionSymbols = this.processTransitions(transitions);
    this.drawAllTransitions(transitions, transitionSymbols);
  }

  processTransitions(transitions) {
    const transitionSymbols = new Map();
    transitions.forEach(transition => {
      const transitionKey = `${transition.fromState.name}-${transition.toState.name}`;
      const existingSymbols = transitionSymbols.get(transitionKey) || "";
      const symbolsSet = new Set(existingSymbols.split(',').filter(s => s));
      symbolsSet.add(transition.symbol);
      transitionSymbols.set(transitionKey, Array.from(symbolsSet).join(', '));
    });
    return transitionSymbols;
  }

  drawAllTransitions(transitions, transitionSymbols) {
    transitionSymbols.forEach((symbols, key) => {
      const [fromStateName, toStateName] = key.split('-');
      const fromState = transitions.find(t => t.fromState.name === fromStateName).fromState;
      const toState = transitions.find(t => t.toState.name === toStateName).toState;

      if (fromState && toState) {
        const isBidirectional = transitionSymbols.has(`${toStateName}-${fromStateName}`);
        if (fromState === toState) {
          this.drawSelfTransition(fromState, symbols);
        } else {
          this.drawTransition(fromState, toState, symbols, isBidirectional);
        }
      }
    });
  }

  drawTransition(fromState, toState, symbols, isBidirectional) {
    const dx = toState.x - fromState.x;
    const dy = toState.y - fromState.y;
    const angle = Math.atan2(dy, dx);
    const radius = 30;

    const offset = isBidirectional ? 10 : 0;
    const fromEdgeX = fromState.x + radius * Math.cos(angle) + offset * Math.sin(angle);
    const fromEdgeY = fromState.y + radius * Math.sin(angle) - offset * Math.cos(angle);
    const toEdgeX = toState.x - radius * Math.cos(angle) + offset * Math.sin(angle);
    const toEdgeY = toState.y - radius * Math.sin(angle) - offset * Math.cos(angle);

    this.ctx.beginPath();
    this.ctx.moveTo(fromEdgeX, fromEdgeY);
    this.ctx.lineTo(toEdgeX, toEdgeY);
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.drawArrow(toEdgeX, toEdgeY, fromEdgeX, fromEdgeY);

    const symbolOffset = 18;
    const midX = (fromEdgeX + toEdgeX) / 2 + symbolOffset * Math.sin(angle);
    const midY = (fromEdgeY + toEdgeY) / 2 - symbolOffset * Math.cos(angle);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 14px Roboto, sans-serif';
    this.ctx.fillText(symbols, midX, midY);
  }

  drawSelfTransition(position, symbols) {
    const loopRadius = 40;
    const offset = 10;
    const startX = position.x - offset;
    const startY = position.y + 30;
    const endX = position.x + offset;
    const endY = position.y + 30;
    const controlX1 = position.x - loopRadius;
    const controlY1 = position.y + loopRadius * 2;
    const controlX2 = position.x + loopRadius;
    const controlY2 = position.y + loopRadius * 2;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.drawArrow(endX, endY, controlX2, controlY2);
    this.drawSymbol(symbols, position.x, position.y + loopRadius * 2);
  }

  drawArrow(x, y, fromX, fromY) {
    const angle = Math.atan2(y - fromY, x - fromX);
    const arrowAngle = Math.PI / 6;
    const arrowLength = 10;

    const arrowX1 = x - arrowLength * Math.cos(angle - arrowAngle);
    const arrowY1 = y - arrowLength * Math.sin(angle - arrowAngle);
    const arrowX2 = x - arrowLength * Math.cos(angle + arrowAngle);
    const arrowY2 = y - arrowLength * Math.sin(angle + arrowAngle);

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(arrowX1, arrowY1);
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(arrowX2, arrowY2);
    this.ctx.stroke();
  }

  drawPreviewTransition(fromPosition, toX, toY) {
    const dx = toX - fromPosition.x;
    const dy = toY - fromPosition.y;
   
    const angle = Math.atan2(dy, dx);
  
    const fromCenterX = fromPosition.x + 30 * Math.cos(angle);
    const fromCenterY = fromPosition.y + 30 * Math.sin(angle);
  
    this.ctx.beginPath();
    this.ctx.moveTo(fromCenterX, fromCenterY);
    this.ctx.lineTo(toX, toY);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  drawSymbol(symbol, x, y) {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 14px Roboto, sans-serif';
    this.ctx.fillText(symbol, x, y);
  }

  getTransitionAtPosition(transitions, x, y) {
    return transitions.find(transition => {
      const fromPosition = transition.fromState;
      const toPosition = transition.toState;
      const midpointX = (fromPosition.x + toPosition.x) / 2;
      const midpointY = (fromPosition.y + toPosition.y) / 2;
      const dx = x - midpointX;
      const dy = y - midpointY;
      return dx * dx + dy * dy <= 20 * 20;
    });
  }
}
