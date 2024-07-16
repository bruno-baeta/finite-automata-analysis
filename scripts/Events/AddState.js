export class AddState {
    constructor(renderer) {
        this.renderer = renderer; // Recebe a instância do renderer
        this.canvas = renderer.canvas.canvas; // Inicializa o canvas
        this.canvas.addEventListener('click', this.onClick.bind(this));
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.stateCounter = 0; // Contador para nomear os estados (A, B, ..., Z, Aa, Bb, ..., Zz)
        this.keyPressed = null; // Variável para rastrear qual tecla está pressionada
        this.isDragging = false; // Variável para rastrear se um estado está sendo arrastado

        // Adiciona manipuladores de eventos para keydown e keyup
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event) {
        this.keyPressed = event.key; // Armazena a tecla pressionada
    }

    onKeyUp(event) {
        this.keyPressed = null; // Reseta a variável quando nenhuma tecla está pressionada
    }

    onMouseDown(event) {
        // Verifica se um estado está sendo clicado para arrastar
        const rect = this.canvas.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const state = this.renderer.getStateAtPosition(offsetX, offsetY);

        if (state) {
            this.isDragging = true;
        }
    }

    onMouseUp(event) {
        // Define que o arraste terminou
        this.isDragging = false;
    }

    onClick(event) {
        if (this.isDragging || this.keyPressed !== 'c' && this.keyPressed !== 'C') {
            return; // Se estiver arrastando ou a tecla pressionada não for 'c', não adiciona um novo estado
        }

        // Obtém as coordenadas de clique do mouse no canvas
        const rect = this.canvas.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const stateName = this.getStateName();
        this.renderer.afd.addState(stateName);
        this.renderer.statePositions.set(stateName, { x: offsetX, y: offsetY });
        this.renderState(stateName, offsetX, offsetY);
    }

    getStateName() {
        // Função para obter o próximo nome de estado na sequência alfabética
        let stateName = '';
        let counter = this.stateCounter;
        while (counter >= 0) {
            stateName = String.fromCharCode(65 + (counter % 26)) + stateName;
            counter = Math.floor(counter / 26) - 1;
        }
        this.stateCounter++;
        return stateName;
    }

    renderState(stateName, x, y) {
        // Renderiza o estado utilizando o método drawState do renderer
        const isFinal = false; // Ajuste conforme necessário
        const isInitial = false; // Ajuste conforme necessário
        this.renderer.drawState(x, y, stateName, isFinal, isInitial);

        // Atualiza o AFD renderizado após adicionar o estado
        this.renderer.renderAFD(this.renderer.afd);
    }
}
