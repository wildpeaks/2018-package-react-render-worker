# Render to DOM, using a Web Worker

[![Build Status](https://travis-ci.org/wildpeaks/package-react-render-worker.svg?branch=master)](https://travis-ci.org/wildpeaks/package-react-render-worker)

**Renders a React component** in the DOM,
and **listens to a Web Worker** for the props (similar to `@wildpeaks/preact-render-worker`).

Used by the JSON Entry Loader, resulting applications can send Actions messages to the Worker
to modify its internal state, and emit new props.

Install:

	npm install @wildpeaks/react-render-worker

