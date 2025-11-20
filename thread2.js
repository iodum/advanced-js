const slowFunction = (timeout = 3000) => {
    console.log('start thread2');
    let start = performance.now();
    let x = 0;
    let i = 0;
    do {
        i += 1;
        x += (Math.random() - 0.5) * i;
    } while (performance.now() - start < timeout);
    console.log('end thread2', x);
    return x;
}

self.onmessage = function (evt) {
    const result = slowFunction(evt.data);
    self.postMessage(result);
}
