const express = require('express');
const mcache = require('memory-cache');

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 8080;

async function cacheMiddleware(request, response, next) {
    const access = '__express__' + request.url || request.originalUrl;
    const cached = mcache.get(access);
    if (cached) {
        return response.json(cached);
    }
    response.returnJSON = response.json;
    response.json = data => {
        mcache.put(access, data, 3030);
        return response.returnJSON(data);
    }
    next();
}

app.get('/', cacheMiddleware, async (request, response) => {
    response.json({ hello: 'world' });
});

app.listen(SERVER_PORT, () => console.log(`Server ready at *:${SERVER_PORT}`));
