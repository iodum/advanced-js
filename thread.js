self.onmessage = function (evt) {
    console.log('start thread');
    const thread2 = new Worker("./thread2.js");
    thread2.postMessage(evt.data);

    thread2.onmessage = function (evt2) {
        const result = evt2.data;
        thread2.terminate();
        self.postMessage(result);
        console.log('end thread');
    };
}
