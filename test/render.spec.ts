/* eslint-env browser, mocha */
import {createPortal} from 'react-dom';
import {createElement as h, Component, Fragment} from 'react';
import {render} from '../src/render';
// @ts-ignore
import {JSDOM} from 'jsdom';
// @ts-ignore
import * as snapshot from '@wildpeaks/snapshot-dom';


declare type WorkerData = {
	url: string;
	scope: any;
};

declare global {
	namespace NodeJS {
		interface Global {
			window: any;
			document: any;
			Worker: any;
			workers: WorkerData[];
		}
	}
}

function FakeWorker(this: any, url: string) {
	this.onmessage = null;
	this.postMessage = jasmine.createSpy();
	global.workers.push({url, scope: this});
}


function test_detached_container(): void {
	const container = document.createElement('div');
	container.className = 'mycontainer';

	expect(snapshot.toJSON(document.body))
	.toEqual({
		tagName: 'body'
	});
	expect(snapshot.toJSON(container))
	.toEqual({
		tagName: 'div',
		attributes: {
			class: 'mycontainer'
		}
	});
	expect(global.workers.length).toBe(0);

	expect(typeof window.dispatch).toBe('undefined');
	let throws = false;
	try {
		render(container, 'article', 'fake.worker.js');
	} catch(e){
		throws = e;
	}
	expect(throws).toBe(false);
	expect(typeof window.dispatch).toBe('function');

	expect(global.workers.length).toBe(1);
	if (global.workers.length > 0){
		const worker = global.workers[0]; // eslint-disable-line prefer-destructuring
		expect(worker.url).toBe('fake.worker.js');

		const calls = worker.scope.postMessage.calls.all();
		expect(calls.length).toEqual(0);

		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body'
		});

		expect(typeof worker.scope.onmessage).toBe('function');
		const emit = worker.scope.onmessage.bind(worker.scope);

		emit({
			data: {
				class: 'first'
			}
		});
		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body'
		});
		expect(snapshot.toJSON(container))
		.toEqual({
			tagName: 'div',
			attributes: {
				class: 'mycontainer'
			},
			childNodes: [
				{
					tagName: 'article',
					attributes: {
						class: 'first'
					}
				}
			]
		});
	}
}


function test_multiple_messages(): void {
	expect(snapshot.toJSON(document.body))
	.toEqual({
		tagName: 'body'
	});
	expect(global.workers.length).toBe(0);

	expect(typeof window.dispatch).toBe('undefined');
	let throws = false;
	try {
		render(document.body, 'article', 'fake.worker.js');
	} catch(e){
		throws = e;
	}
	expect(throws).toBe(false);
	expect(typeof window.dispatch).toBe('function');

	expect(global.workers.length).toBe(1);
	if (global.workers.length > 0){
		const worker = global.workers[0]; // eslint-disable-line prefer-destructuring
		expect(worker.url).toBe('fake.worker.js');

		const calls = worker.scope.postMessage.calls.all();
		expect(calls.length).toEqual(0);

		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'div'
				}
			]
		});

		expect(typeof worker.scope.onmessage).toBe('function');
		const emit = worker.scope.onmessage.bind(worker.scope);

		emit({
			data: {
				class: 'first'
			}
		});
		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'article',
					attributes: {
						class: 'first'
					}
				}
			]
		});

		emit({
			data: {
				class: 'second'
			}
		});
		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'article',
					attributes: {
						class: 'second'
					}
				}
			]
		});
	}
}


function test_replace_contents(): void {
	document.body.innerHTML = '<section class="hello"></section>';
	expect(snapshot.toJSON(document.body))
	.toEqual({
		tagName: 'body',
		childNodes: [
			{
				tagName: 'section',
				attributes: {
					class: 'hello'
				}
			}
		]
	});
	expect(global.workers.length).toBe(0);

	expect(typeof window.dispatch).toBe('undefined');
	let throws = false;
	try {
		render(document.body, 'article', 'fake.worker.js');
	} catch(e){
		throws = e;
	}
	expect(throws).toBe(false);
	expect(typeof window.dispatch).toBe('function');

	expect(global.workers.length).toBe(1);
	if (global.workers.length > 0){
		const worker = global.workers[0]; // eslint-disable-line prefer-destructuring
		expect(worker.url).toBe('fake.worker.js');

		const calls = worker.scope.postMessage.calls.all();
		expect(calls.length).toEqual(0);

		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'section',
					attributes: {
						class: 'hello'
					}
				}
			]
		});

		expect(typeof worker.scope.onmessage).toBe('function');
		const emit = worker.scope.onmessage.bind(worker.scope);

		emit({
			data: {
				class: 'first'
			}
		});
		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'article',
					attributes: {
						class: 'first'
					}
				}
			]
		});
	}
}


function test_stateless_component(): void {
	document.body.innerHTML = '<section class="hello"></section>';
	expect(snapshot.toJSON(document.body))
	.toEqual({
		tagName: 'body',
		childNodes: [
			{
				tagName: 'section',
				attributes: {
					class: 'hello'
				}
			}
		]
	});
	expect(global.workers.length).toBe(0);

	interface StatelessProps {
		href: string;
	}
	const Stateless = (props: StatelessProps) => h('a', props);

	expect(typeof window.dispatch).toBe('undefined');
	let throws = false;
	try {
		render<StatelessProps>(document.body, Stateless, 'fake.worker.js');
	} catch(e){
		throws = e;
	}
	expect(throws).toBe(false);
	expect(typeof window.dispatch).toBe('function');

	expect(global.workers.length).toBe(1);
	if (global.workers.length > 0){
		const worker = global.workers[0]; // eslint-disable-line prefer-destructuring
		expect(worker.url).toBe('fake.worker.js');

		const calls = worker.scope.postMessage.calls.all();
		expect(calls.length).toEqual(0);

		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'section',
					attributes: {
						class: 'hello'
					}
				}
			]
		});

		expect(typeof worker.scope.onmessage).toBe('function');
		const emit = worker.scope.onmessage.bind(worker.scope);

		emit({
			data: {
				href: 'modified'
			}
		});
		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'a',
					attributes: {
						href: 'modified'
					}
				}
			]
		});
	}
}


function test_stateless_array_component(): void {
	document.body.innerHTML = '<section class="hello"></section>';
	expect(snapshot.toJSON(document.body))
	.toEqual({
		tagName: 'body',
		childNodes: [
			{
				tagName: 'section',
				attributes: {
					class: 'hello'
				}
			}
		]
	});
	expect(global.workers.length).toBe(0);

	interface StatelessProps {
		param1: string;
		param2: string;
	}
	const Stateless = (props: StatelessProps) => [
		h('a', {href: props.param1}),
		h('a', {href: props.param2})
	];

	expect(typeof window.dispatch).toBe('undefined');
	let throws = false;
	try {
		// @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20356 https://github.com/Microsoft/TypeScript/pull/20239
		render<StatelessProps>(document.body, Stateless, 'fake.worker.js');
	} catch(e){
		throws = e;
	}
	expect(throws).toBe(false);
	expect(typeof window.dispatch).toBe('function');

	expect(global.workers.length).toBe(1);
	if (global.workers.length > 0){
		const worker = global.workers[0]; // eslint-disable-line prefer-destructuring
		expect(worker.url).toBe('fake.worker.js');

		const calls = worker.scope.postMessage.calls.all();
		expect(calls.length).toEqual(0);

		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'section',
					attributes: {
						class: 'hello'
					}
				}
			]
		});

		expect(typeof worker.scope.onmessage).toBe('function');
		const emit = worker.scope.onmessage.bind(worker.scope);

		emit({
			data: {
				param1: 'value1',
				param2: 'value2'
			}
		});
		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'a',
					attributes: {
						href: 'value1'
					}
				},
				{
					tagName: 'a',
					attributes: {
						href: 'value2'
					}
				}
			]
		});
	}
}


function test_stateless_fragment_component(): void {
	document.body.innerHTML = '<section class="hello"></section>';
	expect(snapshot.toJSON(document.body))
	.toEqual({
		tagName: 'body',
		childNodes: [
			{
				tagName: 'section',
				attributes: {
					class: 'hello'
				}
			}
		]
	});
	expect(global.workers.length).toBe(0);

	interface StatelessProps {
		param1: string;
		param2: string;
	}
	const Stateless = (props: StatelessProps) => h(Fragment, {}, [
		h('a', {href: props.param1}),
		h('a', {href: props.param2})
	]);

	expect(typeof window.dispatch).toBe('undefined');
	let throws = false;
	try {
		render<StatelessProps>(document.body, Stateless, 'fake.worker.js');
	} catch(e){
		throws = e;
	}
	expect(throws).toBe(false);
	expect(typeof window.dispatch).toBe('function');

	expect(global.workers.length).toBe(1);
	if (global.workers.length > 0){
		const worker = global.workers[0]; // eslint-disable-line prefer-destructuring
		expect(worker.url).toBe('fake.worker.js');

		const calls = worker.scope.postMessage.calls.all();
		expect(calls.length).toEqual(0);

		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'section',
					attributes: {
						class: 'hello'
					}
				}
			]
		});

		expect(typeof worker.scope.onmessage).toBe('function');
		const emit = worker.scope.onmessage.bind(worker.scope);

		emit({
			data: {
				param1: 'value1',
				param2: 'value2'
			}
		});
		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'a',
					attributes: {
						href: 'value1'
					}
				},
				{
					tagName: 'a',
					attributes: {
						href: 'value2'
					}
				}
			]
		});
	}
}


function test_stateless_portal_component(): void {
	document.body.innerHTML = '<section class="hello"></section>';
	expect(snapshot.toJSON(document.body))
	.toEqual({
		tagName: 'body',
		childNodes: [
			{
				tagName: 'section',
				attributes: {
					class: 'hello'
				}
			}
		]
	});
	const portalContainer = document.createElement('article');
	expect(snapshot.toJSON(portalContainer))
	.toEqual({
		tagName: 'article'
	});
	expect(global.workers.length).toBe(0);

	interface StatelessProps {
		href: string;
		container: HTMLElement;
	}
	const Stateless = (props: StatelessProps) => {
		const title = h('h1', {}, props.href);
		return h('a', {href: props.href}, createPortal(title, props.container));
	};
	expect(typeof window.dispatch).toBe('undefined');
	let throws = false;
	try {
		render<StatelessProps>(document.body, Stateless, 'fake.worker.js');
	} catch(e){
		throws = e;
	}
	expect(throws).toBe(false);
	expect(typeof window.dispatch).toBe('function');

	expect(global.workers.length).toBe(1);
	if (global.workers.length > 0){
		const worker = global.workers[0]; // eslint-disable-line prefer-destructuring
		expect(worker.url).toBe('fake.worker.js');

		const calls = worker.scope.postMessage.calls.all();
		expect(calls.length).toEqual(0);

		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'section',
					attributes: {
						class: 'hello'
					}
				}
			]
		});

		expect(typeof worker.scope.onmessage).toBe('function');
		const emit = worker.scope.onmessage.bind(worker.scope);

		emit({
			data: {
				href: 'example',
				container: portalContainer
			}
		});
		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'a',
					attributes: {
						href: 'example'
					}
				}
			]
		});
		expect(snapshot.toJSON(portalContainer))
		.toEqual({
			tagName: 'article',
			childNodes: [
				{
					tagName: 'h1',
					childNodes: [
						{
							nodeName: '#text',
							nodeValue: 'example'
						}
					]
				}
			]
		});
	}
}


function test_stateful_component(): void {
	document.body.innerHTML = '<section class="hello"></section>';
	expect(snapshot.toJSON(document.body))
	.toEqual({
		tagName: 'body',
		childNodes: [
			{
				tagName: 'section',
				attributes: {
					class: 'hello'
				}
			}
		]
	});
	expect(global.workers.length).toBe(0);

	interface StatefulProps {
		href: string;
	}
	interface StatefulState {
		something: boolean;
	}
	class Stateful extends Component<StatefulProps, StatefulState> {
		render() { // eslint-disable-line class-methods-use-this
			return h('a', this.props);
		}
	}

	expect(typeof window.dispatch).toBe('undefined');
	let throws = false;
	try {
		render<StatefulProps>(document.body, Stateful, 'fake.worker.js');
	} catch(e){
		throws = e;
	}
	expect(throws).toBe(false);
	expect(typeof window.dispatch).toBe('function');

	expect(global.workers.length).toBe(1);
	if (global.workers.length > 0){
		const worker = global.workers[0]; // eslint-disable-line prefer-destructuring
		expect(worker.url).toBe('fake.worker.js');

		const calls = worker.scope.postMessage.calls.all();
		expect(calls.length).toEqual(0);

		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'section',
					attributes: {
						class: 'hello'
					}
				}
			]
		});

		expect(typeof worker.scope.onmessage).toBe('function');
		const emit = worker.scope.onmessage.bind(worker.scope);

		emit({
			data: {
				href: 'modified'
			}
		});
		expect(snapshot.toJSON(document.body))
		.toEqual({
			tagName: 'body',
			childNodes: [
				{
					tagName: 'a',
					attributes: {
						href: 'modified'
					}
				}
			]
		});
	}
}


describe('render', () => {
	beforeEach(() => {
		const dom = new JSDOM(`<!DOCTYPE html>`);
		global.window = dom.window;
		global.document = dom.window.document;
		global.workers = [];
		global.Worker = FakeWorker;
	});
	afterEach(() => {
		delete window.dispatch;
		delete global.window;
		delete global.document;
		delete global.workers;
		delete global.Worker;
	});
	it('Detached Container', test_detached_container);
	it('Multiple Messages', test_multiple_messages);
	it('Replace Contents', test_replace_contents);
	it('Stateless Component', test_stateless_component);
	it('Stateless Array Component', test_stateless_array_component);
	it('Stateless Fragment Component', test_stateless_fragment_component);
	it('Stateless Portal Component', test_stateless_portal_component);
	it('Stateful Component', test_stateful_component);
});
