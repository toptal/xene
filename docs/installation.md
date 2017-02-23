---
id:       installation
category: guide

---

# Installation
Just run
```sh
npm install xene --save
```

or

```sh
yarn add xene
```

## Xene in the Browser
xene doesn't have any node.js specific dependecies so xene bots can be run in the browser either with webpack or browserify. However xene depends on Promise support. For xene to run in old browsers you should Promise ployfil.

## Typescript typeings
xene is written in Typescript and includes typeings in the node.js module itself, no need to install typeings from the `@types` namespace.
