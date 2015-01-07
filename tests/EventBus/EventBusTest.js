﻿var numOfChildWindows = 5;
var childWindows = [];
for(var i = 0; i < numOfChildWindows; i++){
    childWindows.push(window.open('EventBus-test-child.html', 'EventBus-test-child' + i));
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
describe("EventBus.", function () {
    beforeEach(function (done) {
        done();
    });
    SJ.iwc.EventBus.once('testEvent', function () {
        expect('Events fired in this window').toBe('handled only by other windows');
    });
    var thisWindowCounter = 0;
    SJ.iwc.EventBus.on('testEvent', function () {
        thisWindowCounter++;
    }, null, true);
    var numOfChanges = 10000;
    var i = 0;
    var changesPerInterval = 100;
    var fillFunc = function () {
        for (var j = 0; j < changesPerInterval; j++) {
            SJ.iwc.EventBus.fire('testEvent', i);
            i++;
        }
        if (i < numOfChanges) {
            setTimeout(fillFunc, 10);
        }
    };
    setTimeout(fillFunc, 1000);
    it('Events may be handled or not handled by event sender', function (done) {
        SJ.iwc.EventBus.once('testEvent', function() {
            expect('Events fired in this window').toBe('handled only by other windows');
        });
        setTimeout(function() {
            expect(thisWindowCounter).toEqual(i);
            done();
        }, 10000);
    });
    it('Event propagation stability. Num of changes: ' + numOfChanges, function (done) {
        SJ.forEach(childWindows, function (childWindow) {
            expect(childWindow.data.onCounter).toEqual(i);
        });
        done();
    });
    it('Data propagation stability. Num of changes: ' + numOfChanges, function (done) {
        SJ.forEach(childWindows, function (childWindow) {
            expect(childWindow.data.testValue).toEqual(i - 1);
        });
        done();
    });
});


SJ.windowOn('unload', function () {
    SJ.forEach(childWindows, function (childWindow) {
        childWindow.close();
    });
});