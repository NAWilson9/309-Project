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

var assert = require('chai').assert;
var expected, current;

before(function(){
    expected = ['a', 'b', 'c'];
});

describe('server', function(){
    beforeEach(function(){
        current = 'a,b,c'.split(',');
    });

    it('should return an array', function(){
        assert(Array.isArray(current));
    });

    it('should return the same array', function(){
        assert.equal(expected.length, current.length, 'arrays have equal length');

        for (var i=0; i<expected.length; i++) {
            assert.equal(expected[i], current[i], i + 'element is equal');
        }
    })
});