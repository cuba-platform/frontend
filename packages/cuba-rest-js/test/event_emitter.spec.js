const assert = require('assert');

const { restEventEmitter } = require('../dist-node/event_emitter');

describe('event_emitter', function() {
    it('.event_emitter emit events and subscribers receive events', function() {
        const receivedEvents = [];

        restEventEmitter.on('fetch_fail', (param1) =>{
            receivedEvents.push(param1);
        });

        restEventEmitter.on('fetch_fail', (param1) =>{
            receivedEvents.push(param1);
        });

        restEventEmitter.emit('fetch_fail', 'param1');
        restEventEmitter.emit('fetch_fail', 'param2');


        assert.equal(JSON.stringify(receivedEvents), JSON.stringify(['param1', 'param1', 'param2', 'param2']));
    });

    it('.event_emitter .once works as expected', function() {
        const receivedEvents = [];

        restEventEmitter.once('fetch_fail', (param1) =>{
            receivedEvents.push(param1);
        });

        restEventEmitter.emit('fetch_fail', 'param1');
        restEventEmitter.emit('fetch_fail', 'param2');


        assert.equal(JSON.stringify(receivedEvents), JSON.stringify(['param1']));
    });

    it('.event_emitter .off works as expected', function() {
        const receivedEvents = [];

        const unsubscribe = restEventEmitter.on('fetch_fail', (param1) =>{
            receivedEvents.push(param1);
        });

        restEventEmitter.emit('fetch_fail', 'param1');
        unsubscribe();
        restEventEmitter.emit('fetch_fail', 'param2');

        function eventHandler(param1) {
            receivedEvents.push(param1);
        }

        restEventEmitter.on('fetch_fail', eventHandler);

        restEventEmitter.emit('fetch_fail', 'param3');
        restEventEmitter.off('fetch_fail', eventHandler);
        restEventEmitter.emit('fetch_fail', 'param4');


        assert.equal(JSON.stringify(receivedEvents), JSON.stringify(['param1', 'param3']));
    });
});