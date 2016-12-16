/* eslint-env browser */
'use strict';
const {createElement} = require('react');
const {render} = require('react-dom');

function required(){
	throw new Error('Missing required parameter');
}


/**
 * Renders a component using props emitted from a Web Worker (replaces contents of the container).
 * @param  {HTMLElement}    container      HTML tag to render into
 * @param  {ReactClass}     Component      React component to render
 * @param  {String}         workerUrl      URL of the Web Worker
 * @param  {Object}         workerMessage  Initial message sent to the Web Worker
 */
module.exports = function renderWorker(container = required(), Component = required(), workerUrl = required(), workerMessage = required()){
	const worker = new Worker(workerUrl);
	window.dispatch = worker.postMessage.bind(worker);
	worker.onmessage = e => {
		render(createElement(Component, e.data), container);
	};
	worker.postMessage(workerMessage);
};
