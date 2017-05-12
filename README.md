# ms-rest
TS Runtime

## Requirements
- node.js version > 6.x
- npm install -g typescript

## Installation
- After cloning the repo, execute `npm install`

## Execution

### node.js
- `tsc sample.ts --lib es6 --outDir dist`
- `node dist/sample.js`

### In the browser
- `npm run build`
- open index.html file in the browser. It should show the response from GET request on the pet. From Chrome type Ctrl + Shift + J and you can see the logs in console.
