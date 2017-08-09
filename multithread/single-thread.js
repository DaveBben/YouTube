var cash = 1000000

function aliceSpend() {
    console.log("Alice just joined");
    while (cash > 0) {
        cash -= 5;
        console.log(`Alice just spent money. Cash left is ${cash} `);
    }
}

function bobSpend() {
    while (cash > 0) {
        cash -= 5;
        console.log(`Bob just spent money. Cash left is ${cash} `);
    }
}

setTimeout(function () { aliceSpend() }, 1000);

bobSpend();

