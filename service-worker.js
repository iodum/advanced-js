const slowFunction = (timeout = 3000) => {
    console.log('start slowFunction');
    let start = performance.now();
    let x = 0;
    let i = 0;
    do {
        i += 1;
        x += (Math.random() - 0.5) * i;
    } while (performance.now() - start < timeout);
    console.log('end slowFunction', x);
    return x;
}

const cache = {
    result: null
};

const recalculate = (timeout) => {
    cache.result = slowFunction(timeout);
    return cache.result;
}

const broadcast = async (msg) => {
    const clients = await self.clients.matchAll();
    for (const client of clients) {
        client.postMessage(msg);
    }
}

self.addEventListener('install', (evt) => {
    evt.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', async (evt) => {
    console.log('activate', evt);
    evt.waitUntil(self.clients.claim());
});

self.addEventListener('message', async (evt) => {
    console.log('message', evt.data);

    const data = evt.data;

    if (data.type === 'RECALCULATE') {
        const result = recalculate(data.timeout);
        await broadcast({type: 'RESULT', result: result});
    } else if (data.type === 'GET_CACHED') {
        if (cache.result !== null) {
            await broadcast({
                type: 'CACHED_RESULT',
                result: cache.result
            });
        }
    }
});
