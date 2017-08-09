var Worker = require('webworker-threads').Worker;
// var w = new Worker('worker.js'); // Standard API

// You may also pass in a function:




var bobWorker = new Worker(function () {
    var cash = 50;
    console.log("Bob just joined");
    postMessage(cash);
    while (cash > 0) {
        cash -= 5;
        console.log(`Bob just spent money. Cash left is ${cash} `);
    }
    this.onmessage = function (event) {
        
        cash = event.data;
    };
});



bobWorker.onmessage = function (event) {
    aliceSpend(event.data);
};



function aliceSpend(cash) {
    console.log(`Alice joined with ${cash} `);
    while (cash > 0) {
        cash -= 5;
        console.log(`Alice just spent money. Cash left is ${cash} `);
        bobWorker.postMessage(cash);
    }

}



// bobWorker.postMessage(1000);

