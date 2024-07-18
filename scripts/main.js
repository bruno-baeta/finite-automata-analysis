import { AutomatonController } from "../controllers/AutomatonController.js";
import { Automaton } from "../models/Automaton.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('automatonCanvas');
  const automaton = new Automaton();
  const automatonController = new AutomatonController(canvas, automaton);

  // Funções para atualizar os cartões de informações
  function updateAutomatonInfo() {
    document.getElementById('states').textContent = automaton.states.map(state => state.name).join(', ');
    document.getElementById('alphabet').textContent = automaton.alphabet.join(', ');
    document.getElementById('initialStates').textContent = automaton.initial.map(state => state.name).join(', ');
    document.getElementById('finalStates').textContent = automaton.final.map(state => state.name).join(', ');

    // Atualizar a tabela de transições
    const transitionTable = document.getElementById('transitionTable');
    const thead = transitionTable.querySelector('thead tr');
    const tbody = transitionTable.querySelector('tbody');

    // Limpar cabeçalhos e corpo da tabela
    thead.innerHTML = '';
    tbody.innerHTML = '';

    // Coletar símbolos únicos utilizados nas transições
    const usedSymbols = [...new Set(automaton.transitions.map(t => t.symbol))];

    // Adicionar cabeçalho de estado e símbolos utilizados
    const stateHeader = document.createElement('th');
    stateHeader.textContent = 'δ';
    thead.appendChild(stateHeader);

    usedSymbols.forEach(symbol => {
      const th = document.createElement('th');
      th.textContent = symbol;
      thead.appendChild(th);
    });

    // Adicionar linhas para cada estado e suas transições
    automaton.states.forEach(state => {
      const row = document.createElement('tr');
      const stateCell = document.createElement('td');
      stateCell.textContent = state.name;
      row.appendChild(stateCell);

      usedSymbols.forEach(symbol => {
        const cell = document.createElement('td');
        const transitions = automaton.transitions
          .filter(t => t.fromState === state && t.symbol === symbol)
          .map(t => t.toState.name);
        cell.textContent = transitions.length > 0 ? `{ ${transitions.join(', ')} }` : '-';
        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });
  }

  automatonController.setUpdateCallback(updateAutomatonInfo);

  // Inicializa o autômato e atualiza as informações inicialmente
  automatonController.initialize();

  // Mostrar pop-up de transições
  document.getElementById('showTransitions').addEventListener('click', () => {
    const popup = document.getElementById('transitionPopup');
    popup.classList.remove('hidden');
    popup.style.display = 'block';
  });

  // Fechar pop-up de transições
  document.getElementById('closePopup').addEventListener('click', () => {
    const popup = document.getElementById('transitionPopup');
    popup.classList.add('hidden');
    popup.style.display = 'none';
  });

  // Função para permitir arrastar o pop-up
  function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  dragElement(document.getElementById('transitionPopup'));

  // Substitui métodos do automatonController para atualizar as informações após cada modificação
  const originalAddState = automatonController.addStateAtPosition.bind(automatonController);
  automatonController.addStateAtPosition = (x, y) => {
    originalAddState(x, y);
    updateAutomatonInfo();
  };

  const originalSetInitialState = automatonController.toggleInitialState.bind(automatonController);
  automatonController.toggleInitialState = (state) => {
    originalSetInitialState(state);
    updateAutomatonInfo();
  };

  const originalToggleFinalState = automatonController.toggleFinalState.bind(automatonController);
  automatonController.toggleFinalState = (state) => {
    originalToggleFinalState(state);
    updateAutomatonInfo();
  };

  const originalAddTransition = automatonController.addTransition.bind(automatonController);
  automatonController.addTransition = (fromState, toState, symbol) => {
    originalAddTransition(fromState, toState, symbol);
    updateAutomatonInfo();
  };

  const originalRemoveState = automatonController.removeState.bind(automatonController);
  automatonController.removeState = (stateName) => {
    originalRemoveState(stateName);
    updateAutomatonInfo();
  };

  const originalRemoveTransition = automatonController.removeTransition.bind(automatonController);
  automatonController.removeTransition = (transition) => {
    originalRemoveTransition(transition);
    updateAutomatonInfo();
  };
});
