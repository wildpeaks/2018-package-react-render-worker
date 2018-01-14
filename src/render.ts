/* eslint-env browser */
/* eslint-disable indent */
import {createElement as h} from 'react';
import {render as reactRender} from 'react-dom';

declare global {
	interface Window {
		dispatch?: (message: any) => void;
	}
}

/**
 * Renders a React component in the DOM, and listens to a Web Worker for the props.
 * @param container DOM element to render into
 * @param ComponentClass Preact component class to render
 * @param workerUrl URL of the Web Worker
 */
export function render<Props>(
	container: Element,
	ComponentClass: React.ComponentType<Props> | string,
	workerUrl: string
): void {
	if (container.firstChild === null){
		container.appendChild(document.createElement('div'));
	}
	const worker = new Worker(workerUrl);
	window.dispatch = worker.postMessage.bind(worker);
	worker.onmessage = e => {
		if (e.data){
			const component = h(ComponentClass, e.data);
			reactRender(component, container);
		}
	};
}
