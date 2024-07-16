export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.statePositions = new Map();
        this.transitionSymbols = new Map();
    }

    renderAFD(afd) {
        console.log('Rendering AFD:', afd);
        this.canvas.clear();
        this.afd = afd; // Salvar o AFD atual
        this.layoutStates(afd.states);
        this.transitionSymbols.clear(); // Limpa o mapa de símbolos de transição
        afd.states.forEach(state => this.renderState(state, afd));
        afd.transitions.forEach(transition => this.updateTransitionSymbols(transition));
        this.renderAllTransitions(afd);
    }

    layoutStates(states) {
        const { width, height } = this.canvas.canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) / 2;

        let index = 0;
        states.forEach(state => {
            const angle = (index / states.size) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            this.statePositions.set(state.name, { x, y });
            console.log(`State ${state.name} positioned at (${x}, ${y})`);
            index++;
        });
    }

    renderState(state, afd) {
        const { context } = this;
        const { x, y } = this.statePositions.get(state.name);
        console.log(`Rendering state ${state.name} at (${x}, ${y})`);
        context.beginPath();
        context.arc(x, y, 30, 0, 2 * Math.PI);
        context.fillStyle = '#1e1e1e'; // fill color (same as canvas background)
        context.fill();
        context.strokeStyle = '#ffffff'; // border color
        context.lineWidth = 2;
        context.stroke();

        context.fillStyle = '#ffffff'; // text color
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = 'bold 16px Roboto, sans-serif'; // set font to Roboto, bold, size 16
        context.fillText(state.name, x, y);

        if (afd.final.has(state)) {
            context.beginPath();
            context.arc(x, y, 25, 0, 2 * Math.PI);
            context.stroke();
        }

        if (afd.initial === state) {
            this.drawInitialArrow(x - 50, y, x - 30, y);
        }
    }

    drawInitialArrow(startX, startY, endX, endY) {
        const { context } = this;
        const angle = Math.atan2(endY - startY, endX - startX);
        const arrowHeadLength = 10;

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = '#ffffff';
        context.lineWidth = 2;
        context.stroke();

        context.beginPath();
        context.moveTo(endX, endY);
        context.lineTo(endX - arrowHeadLength * Math.cos(angle - Math.PI / 6), endY - arrowHeadLength * Math.sin(angle - Math.PI / 6));
        context.moveTo(endX, endY);
        context.lineTo(endX - arrowHeadLength * Math.cos(angle + Math.PI / 6), endY - arrowHeadLength * Math.sin(angle + Math.PI / 6));
        context.stroke();
    }

    updateTransitionSymbols(transition) {
        const transitionKey = `${transition.fromState.name}-${transition.toState.name}`;
        if (this.transitionSymbols.has(transitionKey)) {
            // Concatenate symbols if the transition already exists
            const existingSymbols = this.transitionSymbols.get(transitionKey);
            this.transitionSymbols.set(transitionKey, `${existingSymbols},${transition.symbol}`);
        } else {
            // Add new transition symbol
            this.transitionSymbols.set(transitionKey, transition.symbol);
        }
    }

    renderAllTransitions(afd) {
        afd.transitions.forEach(transition => {
            const fromPosition = this.statePositions.get(transition.fromState.name);
            const toPosition = this.statePositions.get(transition.toState.name);
            const radius = 30; // radius of the state circle
            const transitionKey = `${transition.fromState.name}-${transition.toState.name}`;
            const symbol = this.transitionSymbols.get(transitionKey);

            if (transition.fromState === transition.toState) {
                this.renderSelfTransition(fromPosition, radius, symbol);
            } else {
                this.renderNormalTransition(fromPosition, toPosition, radius, symbol, this.isBidirectional(afd, transition));
            }
        });
    }

    renderSelfTransition(position, radius, symbol) {
        const { context } = this;
        const loopRadius = 40; // Radius for the loop
        const offset = 10; // Small offset for close loop ends

        const startX = position.x - offset;
        const startY = position.y + radius;
        const endX = position.x + offset;
        const endY = position.y + radius;

        const controlX1 = position.x - loopRadius;
        const controlY1 = position.y + loopRadius * 2;
        const controlX2 = position.x + loopRadius;
        const controlY2 = position.y + loopRadius * 2;

        context.beginPath();
        context.moveTo(startX, startY);
        context.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
        context.strokeStyle = '#ffffff';
        context.lineWidth = 2;
        context.stroke();

        this.drawArrow(endX, endY, controlX2, controlY2);

        // Draw the symbol near the loop
        const symbolX = position.x;
        const symbolY = position.y + loopRadius * 2;

        context.fillStyle = '#ffffff'; // text color
        context.font = 'bold 14px Roboto, sans-serif'; // set font to Roboto, bold, size 14
        context.fillText(symbol, symbolX, symbolY);
    }

    renderNormalTransition(fromPosition, toPosition, radius, symbol, isBidirectional) {
        const { context } = this;
        const dx = toPosition.x - fromPosition.x;
        const dy = toPosition.y - fromPosition.y;
        const angle = Math.atan2(dy, dx);

        const offset = isBidirectional ? 10 : 0;
        const fromEdgeX = fromPosition.x + radius * Math.cos(angle) + offset * Math.sin(angle);
        const fromEdgeY = fromPosition.y + radius * Math.sin(angle) - offset * Math.cos(angle);
        const toEdgeX = toPosition.x - radius * Math.cos(angle) + offset * Math.sin(angle);
        const toEdgeY = toPosition.y - radius * Math.sin(angle) - offset * Math.cos(angle);

        // Draw only if not already drawn
        const transitionKey = `${fromPosition.x}-${fromPosition.y}-${toPosition.x}-${toPosition.y}`;
        if (!this.transitionSymbols.has(transitionKey)) {
            context.beginPath();
            context.moveTo(fromEdgeX, fromEdgeY);
            context.lineTo(toEdgeX, toEdgeY);
            context.strokeStyle = '#ffffff';
            context.lineWidth = 2;
            context.stroke();
            this.transitionSymbols.set(transitionKey, symbol);
        }

        this.drawArrow(toEdgeX, toEdgeY, toEdgeX - radius * Math.cos(angle), toEdgeY - radius * Math.sin(angle));

        // Draw the symbol next to the line
        const symbolOffset = 18; // offset from the line
        const midX = (fromEdgeX + toEdgeX) / 2 + symbolOffset * Math.sin(angle);
        const midY = (fromEdgeY + toEdgeY) / 2 - symbolOffset * Math.cos(angle);
        context.fillStyle = '#ffffff'; // text color
        context.font = 'bold 14px Roboto, sans-serif'; // set font to Roboto, bold, size 14
        context.fillText(symbol, midX, midY);
    }

    drawArrow(x, y, fromX, fromY) {
        const { context } = this;
        const angle = Math.atan2(y - fromY, x - fromX);
        const arrowAngle = Math.PI / 6;
        const arrowLength = 10;

        const arrowX1 = x - arrowLength * Math.cos(angle - arrowAngle);
        const arrowY1 = y - arrowLength * Math.sin(angle - arrowAngle);
        const arrowX2 = x - arrowLength * Math.cos(angle + arrowAngle);
        const arrowY2 = y - arrowLength * Math.sin(angle + arrowAngle);

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(arrowX1, arrowY1);
        context.moveTo(x, y);
        context.lineTo(arrowX2, arrowY2);
        context.stroke();
    }

    isBidirectional(afd, transition) {
        const transitionsArray = Array.from(afd.transitions);
        return transitionsArray.some(t =>
            t.fromState.name === transition.toState.name && t.toState.name === transition.fromState.name
        );
    }

    getStateAtPosition(x, y) {
        for (let [name, position] of this.statePositions.entries()) {
            const dx = x - position.x;
            const dy = y - position.y;
            if (dx * dx + dy * dy <= 30 * 30) { // Verifica se o ponto está dentro do círculo de raio 30
                return this.afd.getState(name);
            }
        }
        return null;
    }

    updateStatePosition(state, x, y) {
        this.statePositions.set(state.name, { x, y });
    }
}
