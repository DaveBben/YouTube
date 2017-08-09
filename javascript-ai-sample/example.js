// 24 hours - 100k views, 10k comments, 9500 likes

const brain = require('brain.js');

var net = new brain.NeuralNetwork();

var data = [{ input: { v: 1.0, l: 1.0, c: 1.0 }, output: { h: 1 } },
{ input: { v: 0.8, l: 0.75, c: 0.58 }, output: { h: 1 } }, //80k views, 7500 comments 5500 likes 
{ input: { v: 0.85, l: 0.9, c: 0.7 }, output: { h: 1 } },
{ input: { v: 0.92, l: 0.83, c: 0.79 }, output: { h: 1 } },
{ input: { v: 0.0, l: 0.0, c: 0.0 }, output: { b: 1 } },
{ input: { v: 0.2, l: 0.34, c: 0.3 }, output: { b: 1 } },
{ input: { v: 0.5, l: 0.1, c: 0.1 }, output: { b: 1 } },
{ input: { v: 0.3, l: 0.3, c: 0.1 }, output: { b: 1 } },
]

net.train(data, { log: true });

console.log(net.run({ v: 0.15, l: 0.1, c: 0.35 })) //95% boring and 5% a hit

