import { AFD } from './AFD/AFD.js';
import { Canvas } from './Canvas/Canvas.js';
import { Renderer } from './Canvas/Renderer.js';
import { StateMover } from './Events/StateMover.js';
import { SetInitialState } from './Events/SetInitialState.js';
import { AddFinalStates } from './Events/AddFinalStates.js';
import { LinkTransition } from './Events/LinkTransition.js';
import { RemoveTransition } from './Events/RemoveTransition.js';
import { RemoveState } from './Events/RemoveState.js';
import { AddState } from './Events/AddState.js';

document.addEventListener('DOMContentLoaded', (event) => {
    const canvasElement = document.getElementById('afd-canvas');
    const canvas = new Canvas(canvasElement);
    const renderer = new Renderer(canvas);

    const inputModal = document.getElementById('input-modal');
    const inputCloseBtn = inputModal.querySelector('.close-btn');
    const alphabetForm = document.getElementById('alphabet-form');
    const keyboard = document.getElementById('keyboard');
    const submitBtn = alphabetForm.querySelector('.submit-btn');

    // Set para manter o estado de seleção das letras
    const selectedLetters = new Set();

    // Criando teclado de letras
    const letters = '0123456789abcdefghijk'.split('');
    letters.forEach(letter => {
        const key = document.createElement('div');
        key.classList.add('key');
        key.textContent = letter;
        key.addEventListener('click', () => {
            if (selectedLetters.has(letter)) {
                selectedLetters.delete(letter);
                key.classList.remove('selected');
            } else {
                selectedLetters.add(letter);
                key.classList.add('selected');
            }
        });
        keyboard.appendChild(key);
    });

    // Exibir o modal ao carregar a página
    inputModal.style.display = 'block';

    // Fechar modal ao clicar no botão de fechar
    inputCloseBtn.addEventListener('click', function() {
        inputModal.style.display = 'none';
    });

    // Evitar que o formulário seja enviado ao pressionar Enter
    alphabetForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const inputField = document.querySelector('input[name="symbol"]');
        const symbol = inputField.value.trim();

        if (symbol) {
            const existingSymbols = Array.from(document.querySelectorAll('.key')).map(key => key.textContent);
            if (!existingSymbols.includes(symbol)) {
                const key = document.createElement('div');
                key.classList.add('key');
                key.textContent = symbol;
                key.addEventListener('click', () => {
                    if (selectedLetters.has(symbol)) {
                        selectedLetters.delete(symbol);
                        key.classList.remove('selected');
                    } else {
                        selectedLetters.add(symbol);
                        key.classList.add('selected');
                    }
                });
                keyboard.appendChild(key);
            }
        }

        inputField.value = '';
    });

    // Ao clicar no botão de submit
    submitBtn.addEventListener('click', function() {
        // Obter os símbolos selecionados
        const alphabet = Array.from(selectedLetters);

        // Criar o autômato finito determinístico (AFD)
        const afd = new AFD(alphabet);
        renderer.renderAFD(afd);
        new AddState(renderer);
        new StateMover(renderer);
        new SetInitialState(renderer);
        new AddFinalStates(renderer);
        new LinkTransition(renderer);
        new RemoveTransition(renderer);
        new RemoveState(renderer, afd);

        // Esconder o modal após configurar o alfabeto e iniciar o AFD
        inputModal.style.display = 'none';

        // Atualizar informações na interface do usuário
        updateCard(afd);
        updateTransitionsTable(afd);
    });

    // Função para atualizar visualmente os botões selecionados
    function updateSelectedButtons() {
        const allKeys = Array.from(document.querySelectorAll('.key'));
        allKeys.forEach(key => {
            const letter = key.textContent;
            if (selectedLetters.has(letter)) {
                key.classList.add('selected');
            } else {
                key.classList.remove('selected');
            }
        });
    }

    // Atualizar visualmente ao carregar a página
    updateSelectedButtons();

    // Atualizar visualmente ao clicar nos botões do teclado
    keyboard.addEventListener('click', () => {
        updateSelectedButtons();
    });
});

function updateCard(afd) {
    document.getElementById('states').textContent = Array.from(afd.states).join(', ');
    document.getElementById('alphabet').textContent = afd.alphabet.join(', ');
    document.getElementById('initial-state').textContent = afd.initial || 'N/A';
    document.getElementById('final-states').textContent = Array.from(afd.final).join(', ');
}

function updateTransitionsTable(afd) {
    const tableBody = document.querySelector('#transitions-table tbody');
    tableBody.innerHTML = ''; // Limpar as linhas existentes

    afd.transitions.forEach(transition => {
        const row = document.createElement('tr');
        const fromCell = document.createElement('td');
        const toCell = document.createElement('td');
        const symbolCell = document.createElement('td');

        fromCell.textContent = transition.from;
        toCell.textContent = transition.to;
        symbolCell.textContent = transition.symbol;

        row.appendChild(fromCell);
        row.appendChild(toCell);
        row.appendChild(symbolCell);
        tableBody.appendChild(row);
    });
}
