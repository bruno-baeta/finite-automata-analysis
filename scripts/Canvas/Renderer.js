export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.statePositions = new Map();
        this.transitionSymbols = new Map();
        this.afd = { states: new Set(), transitions: new Set(), final: new Set(), initial: null }; // Inicialização básica
    }

    renderAFD(afd) {
        this.canvas.clear();
        this.afd = afd;

        // Layout dos estados somente se não estiverem posicionados ainda
        this.layoutStates(this.afd.states);
        this.transitionSymbols.clear();

        // Renderização dos estados e transições
        this.afd.states.forEach(state => this.renderState(state, this.afd));
        this.afd.transitions.forEach(transition => this.updateTransitionSymbols(transition));
        this.renderAllTransitions(this.afd);
    }

    layoutStates(states) {
        const { width, height } = this.canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) / 2;

        if (this.statePositions.size === 0) {
            let index = 0;
            states.forEach(state => {
                const angle = (index / states.size) * 2 * Math.PI;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                this.statePositions.set(state.name, { x, y });
                index++;
            });
        }
    }

    renderState(state) {
        const position = this.statePositions.get(state.name);
        if (position) {
            const { x, y } = position;
            this.drawState(x, y, state.name, this.afd.final.has(state), this.afd.initial === state);
        } else {
            console.error(`State position for ${state.name} not found`);
        }
    }

    drawState(x, y, name, isFinal, isInitial) {
        const context = this.context;

        context.beginPath();
        context.arc(x, y, 30, 0, 2 * Math.PI);
        context.fillStyle = '#1e1e1e';
        context.fill();
        context.strokeStyle = '#ffffff';
        context.lineWidth = 2;
        context.stroke();

        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = 'bold 16px Roboto, sans-serif';
        context.fillText(name, x, y);

        if (isFinal) {
            context.beginPath();
            context.arc(x, y, 25, 0, 2 * Math.PI);
            context.stroke();
        }

        if (isInitial) {
            this.drawInitialArrow(x - 50, y, x - 30, y);
        }
    }

    drawInitialArrow(startX, startY, endX, endY) {
        const context = this.context;
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
            this.transitionSymbols.set(transitionKey, transition.symbol);
        }
    }

    renderAllTransitions() {
        this.afd.transitions.forEach(transition => {
            const fromPosition = this.statePositions.get(transition.fromState.name);
            const toPosition = this.statePositions.get(transition.toState.name);
            const radius = 30;
            const transitionKey = `${transition.fromState.name}-${transition.toState.name}`;
            const symbol = this.transitionSymbols.get(transitionKey);

            if (transition.fromState === transition.toState) {
                this.renderSelfTransition(fromPosition, radius, symbol);
            } else {
                this.renderNormalTransition(fromPosition, toPosition, radius, symbol, this.isBidirectional(transition));
            }
        });
    }

    renderSelfTransition(position, radius, symbol) {
        const context = this.context;
        const loopRadius = 40;
        const offset = 10;

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

        const symbolX = position.x;
        const symbolY = position.y + loopRadius * 2;

        context.fillStyle = '#ffffff';
        context.font = 'bold 14px Roboto, sans-serif';
        context.fillText(symbol, symbolX, symbolY);
    }

    renderNormalTransition(fromPosition, toPosition, radius, symbol, isBidirectional) {
        const context = this.context;
        const dx = toPosition.x - fromPosition.x;
        const dy = toPosition.y - fromPosition.y;
        const angle = Math.atan2(dy, dx);

        const offset = isBidirectional ? 10 : 0;
        const fromEdgeX = fromPosition.x + radius * Math.cos(angle) + offset * Math.sin(angle);
        const fromEdgeY = fromPosition.y + radius * Math.sin(angle) - offset * Math.cos(angle);
        const toEdgeX = toPosition.x - radius * Math.cos(angle) + offset * Math.sin(angle);
        const toEdgeY = toPosition.y - radius * Math.sin(angle) - offset * Math.cos(angle);

        context.beginPath();
        context.moveTo(fromEdgeX, fromEdgeY);
        context.lineTo(toEdgeX, toEdgeY);
        context.strokeStyle = '#ffffff';
        context.lineWidth = 2;
        context.stroke();

        this.drawArrow(toEdgeX, toEdgeY, fromEdgeX, fromEdgeY);

        const symbolOffset = 18;
        const midX = (fromEdgeX + toEdgeX) / 2 + symbolOffset * Math.sin(angle);
        const midY = (fromEdgeY + toEdgeY) / 2 - symbolOffset * Math.cos(angle);
        context.fillStyle = '#ffffff';
        context.font = 'bold 14px Roboto, sans-serif';
        context.fillText(symbol, midX, midY);
    }

    drawArrow(x, y, fromX, fromY) {
        const context = this.context;
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

    isBidirectional(transition) {
        const transitionsArray = Array.from(this.afd.transitions);
        return transitionsArray.some(t =>
            t.fromState.name === transition.toState.name && t.toState.name === transition.fromState.name
        );
    }

    removeTransition(fromStateName, toStateName) {
        const removed = this.afd.removeTransition(fromStateName, toStateName);
        if (removed) {
            console.log(`Transition removed from ${fromStateName} to ${toStateName}`);
            this.renderAFD(this.afd); // Re-renderiza o AFD após a remoção
        } else {
            console.log(`Transition from ${fromStateName} to ${toStateName} not found.`);
        }
    }

    getStateAtPosition(x, y) {
        for (let [name, position] of this.statePositions.entries()) {
            const dx = x - position.x;
            const dy = y - position.y;
            if (dx * dx + dy * dy <= 30 * 30) {
                return this.afd.getState(name);
            }
        }
        return null;
    }

    updateStatePosition(state, x, y) {
        this.statePositions.set(state.name, { x, y });
        this.renderAFD(this.afd);
    }
}