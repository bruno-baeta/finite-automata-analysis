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

const canvasElement = document.getElementById('afd-canvas');
const canvas = new Canvas(canvasElement);
const renderer = new Renderer(canvas);

// Solicita o alfabeto ao usuário
const alphabetInput = prompt('Enter the alphabet symbols separated by commas (e.g., a,b,c):');
const alphabet = alphabetInput.split(',');

const afd = new AFD(alphabet);

renderer.renderAFD(afd);
new AddState(renderer, afd);
new StateMover(renderer);
new SetInitialState(renderer);
new AddFinalStates(renderer);
new LinkTransition(renderer);
new RemoveTransition(renderer);
new RemoveState(renderer, afd);