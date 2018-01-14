# Render to DOM, using a Web Worker

[![Build Status](https://travis-ci.org/wildpeaks/package-react-render-worker.svg?branch=master)](https://travis-ci.org/wildpeaks/package-react-render-worker)

**Renders a React component** in the DOM,
and **listens to a Web Worker** for the props (similar to `@wildpeaks/preact-render-worker`).

Install:

	npm install @wildpeaks/react-render-worker

Example:
````ts
import {createElement as h, Component} from 'react';
import {render} from '@wildpeaks/react-render-worker';

interface MyProps {
	href: string;
}
interface MyState {
	something: boolean;
}
class MyComponent extends Component<MyProps, MyState> {
	render() {
		return h('a', this.props);
	}
}

const container = document.createElement('div');

// This will render the computer in container everytime the Web Worker emits nes props.
render<MyProps>(container, MyComponent, 'myworker.js');

// Forwards a message to the Web Worker to trigger a change in the Web Worker.
window.dispatch({action: 'example'});
````
