import { AFD } from './AFD/AFD.js';
import { Canvas } from './Canvas/Canvas.js';
import { Renderer } from './Canvas/Renderer.js';

const canvasElement = document.getElementById('afd-canvas');
const canvas = new Canvas(canvasElement);
const renderer = new Renderer(canvas);

const afd = new AFD();

// Exemplo de estados e transições
afd.addState('A');
afd.addState('B');
afd.addState('C');

afd.setInitialState('B');
afd.addFinalState('C');
afd.addFinalState('B');

afd.addTransition('A', 'B', '0');
afd.addTransition('B', 'A', '1');
afd.addTransition('B', 'B', '0');
afd.addTransition('C', 'A', '1');
afd.addTransition('C', 'A', '0');

renderer.renderAFD(afd);