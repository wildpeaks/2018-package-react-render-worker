/* eslint-env node, browser, mocha */
'use strict';
const {strictEqual, deepStrictEqual} = require('assert');
const snapshot = require('@wildpeaks/snapshot-dom');
const sinon = require('sinon');
const render = require('..');


function test_missing_container(){
	const mycontainer = document.getElementById('mycontainer');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Initial snapshot'
	);

	let thrown = false;
	try {
		render();
	} catch(e){
		thrown = true;
	}

	strictEqual(thrown, true, 'Throws an exception');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Container contents have not changed'
	);
}


function test_missing_component(){
	const mycontainer = document.getElementById('mycontainer');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Initial snapshot'
	);

	let thrown = false;
	try {
		render(mycontainer);
	} catch(e){
		thrown = true;
	}

	strictEqual(thrown, true, 'Throws an exception');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Container contents have not changed'
	);
}


function test_missing_url(){
	const mycontainer = document.getElementById('mycontainer');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Initial snapshot'
	);

	let thrown = false;
	try {
		render(mycontainer, 'article');
	} catch(e){
		thrown = true;
	}

	strictEqual(thrown, true, 'Throws an exception');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Container contents have not changed'
	);
}


function test_missing_message(){
	const mycontainer = document.getElementById('mycontainer');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Initial snapshot'
	);

	let thrown = false;
	try {
		render(mycontainer, 'article', 'fake.worker.js');
	} catch(e){
		thrown = true;
	}

	strictEqual(thrown, true, 'Throws an exception');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Container contents have not changed'
	);
}


function test_no_props(){
	const mycontainer = document.getElementById('mycontainer');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Initial snapshot'
	);
	strictEqual(global.workers.length, 0, 'No worker initially');

	let thrown = false;
	try {
		render(mycontainer, 'article', 'fake.worker.js', {hello: 123});
	} catch(e){
		thrown = true;
	}

	strictEqual(thrown, false, 'No exception');
	strictEqual(global.workers.length, 1, 'Only one Worker');

	const worker = global.workers[0];
	const scope = worker.scope;

	strictEqual(worker.url, 'fake.worker.js', 'Worker url');
	strictEqual(scope.postMessage.callCount, 1, 'postMessage called once');
	deepStrictEqual(scope.postMessage.getCall(0).args, [{hello: 123}], 'postMessage message');
	strictEqual(typeof scope.onmessage, 'function', 'onmessage listener');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Container contents have not changed'
	);
}


function test_multiple_props(){
	const mycontainer = document.getElementById('mycontainer');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Initial snapshot'
	);
	strictEqual(global.workers.length, 0, 'No worker initially');

	let thrown = false;
	try {
		render(mycontainer, 'article', 'fake.worker.js', {hello: 123});
	} catch(e){
		thrown = true;
	}

	strictEqual(thrown, false, 'No exception');
	strictEqual(global.workers.length, 1, 'Only one Worker');
	const worker = global.workers[0];
	const scope = worker.scope;
	const emit = scope.onmessage.bind(scope);

	strictEqual(worker.url, 'fake.worker.js', 'Worker url');
	strictEqual(scope.postMessage.callCount, 1, 'postMessage called once');
	deepStrictEqual(scope.postMessage.getCall(0).args, [{hello: 123}], 'postMessage message');
	strictEqual(typeof scope.onmessage, 'function', 'onmessage listener');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			}
		},
		'Container contents have not changed'
	);

	emit({
		data: {
			className: 'first'
		}
	});
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			},
			childNodes: [
				{
					tagName: 'article',
					attributes: {
						class: 'first',
						'data-reactroot': ''
					}
				}
			]
		},
		'Render from first props'
	);

	emit({
		data: {
			className: 'second'
		}
	});
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			},
			childNodes: [
				{
					tagName: 'article',
					attributes: {
						class: 'second',
						'data-reactroot': ''
					}
				}
			]
		},
		'Render from second props'
	);
}


function test_replace_contents(){
	document.body.innerHTML = '<div id="mycontainer"><section class="hello"></section></div>';
	const mycontainer = document.getElementById('mycontainer');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			},
			childNodes: [
				{
					tagName: 'section',
					attributes: {
						class: 'hello'
					}
				}
			]
		},
		'Initial snapshot'
	);
	strictEqual(global.workers.length, 0, 'No worker initially');

	const workerUrl = 'fake.worker.js';
	const initialMessage = {hello: 123};
	let thrown = false;
	try {
		render(mycontainer, 'article', workerUrl, initialMessage);
	} catch(e){
		thrown = true;
	}

	strictEqual(thrown, false, 'No exception');
	strictEqual(global.workers.length, 1, 'Only one Worker');

	const worker = global.workers[0];
	const scope = worker.scope;
	const emit = scope.onmessage.bind(scope);

	strictEqual(worker.url, workerUrl, 'Worker url');
	strictEqual(scope.postMessage.callCount, 1, 'postMessage called once');
	deepStrictEqual(scope.postMessage.getCall(0).args, [initialMessage], 'postMessage message');
	strictEqual(typeof scope.onmessage, 'function', 'onmessage listener');
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			},
			childNodes: [
				{
					tagName: 'section',
					attributes: {
						class: 'hello'
					}
				}
			]
		},
		'Container contents have not changed'
	);

	emit({
		data: {
			className: 'first'
		}
	});
	deepStrictEqual(
		snapshot.toJSON(mycontainer),
		{
			tagName: 'div',
			attributes: {
				id: 'mycontainer'
			},
			childNodes: [
				{
					tagName: 'article',
					attributes: {
						class: 'first',
						'data-reactroot': ''
					}
				}
			]
		},
		'Render from first props'
	);
}


describe('@wildpeaks/react-render-worker', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="mycontainer"></div>';
		global.workers = [];
		global.Worker = function FakeWorker(url){
			this.postMessage = sinon.spy();
			global.workers.push({url, scope: this});
		};
	});
	afterEach(() => {
		delete global.workers;
		delete global.Worker;
	});
	it('Missing container', test_missing_container);
	it('Missing component', test_missing_component);
	it('Missing missing url', test_missing_url);
	it('Missing missing message', test_missing_message);
	it('No props', test_no_props);
	it('Multiple props', test_multiple_props);
	it('Replace contents', test_replace_contents);
});
