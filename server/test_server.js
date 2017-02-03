// var chai = require('chai');
// var server = require('./server');

// describe("Middleware", function() {
//     describe("logging", function(){
//         it('logs incoming Express routes and user IPs to console', function(){
//             var next = function(){};
//             var req = {'originalUrl': 'originalUrl', 'ip': 'ip'};
//             var res = null;
//
//             server.
//         })
//     });
//
//     chai.expect(3).to.equal(6);
// });

var assert = require('assert');
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});