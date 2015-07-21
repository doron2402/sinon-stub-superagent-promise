# sinon-stub-superagent-bluebird-promise V 0.0.11

This package was inspired by sinon-stub-promise in order to test superagent-bluebird-promise.
That makes testing of promises easier when stubbing with [Sinon.JS](http://sinonjs.org/). This library ensures stubbed promises are
evaluated synchronously, so that no special async tricks are required for
testing.

## Installation

Install with npm: `npm install --save-dev sinon-stub-superagent-bluebird-promise`

In node, you can initialize with sinon:

```javascript
var sinon = require('sinon');
var sinonStubPromise = require('sinon-stub-superagent-bluebird-promise');
sinonStubSuperagentBluebirdPromise(sinon);
```

Or in the browser, you can just include
`node_modules/sinon-stub-superagent-bluebird-promise/index.js` (assumes sinon is available on
    window object).

## Example

```javascript
// Code under test


function getValuesByParams(params) {
  var request = require('superagent-bluebird-promise');
  return request
    .get('http://someurl.com/?params=' + params)
    .set({'accept': 'application/vnd.someApp.v2+json'})
    .then(doSomething)
    .catch((e) => {
      console.error(e);
    });

}

// Test
var sinon = require('sinon');
var sinonStubSuperAgentPromise = require('sinon-stub-superagent-bluebird-promise');
describe('stubbing a superagent promise', function() {
    var getStub;

    beforeEach(function() {
      getStub = sinon.stub().returnsPromise();
      getStub.resolves({ body: someData });
      serviceWeWantToTest = proxyquire('../app/services/someService.js', {
        'superagent-bluebird-promise': {
          get: getStub
        }
      });
    });

    it('can resolve', function() {
      promise.resolves('resolve value')

      var testObject = {};
      doSomethingWithAPromise(promise, testObject);
      expect(testObject.resolved).to.eql('resolve value');
      });

    it('can reject', function() {
      promise.rejects('reject value')

      var testObject = {};
      doSomethingWithAPromise(promise, testObject);
      expect(testObject.rejected).to.eql('reject value');
      });
}
```

## Why?
I've look around and could only find the sinon-stub-promise and start changing it so I realize I should create a new package.

    [sinon-as-promised](https://www.npmjs.com/package/sinon-as-promised), uses a
    promise under the hood to achieve the stubbing. The issue with this, is that
    the promise is evaluated asynchronously, so the test code has to deal with that
    by delaying the assertion until the promise has a chance to run.

    Additionally, sinon-as-promised requires you to call either `stub.resolves()`
    or `stub.rejects()` before it will setup the stub as a "thenable" object (one
        that has `then` and `catch` on it). The trouble with this is that if you are
    testing conditional branches (e.g. test what happens when promise succeeds,
        then test what happens when promise fails), you have to either resolve or
    reject the promise for the code under test to pass.

## Stability?

    This is not a [Promises/A+](https://promisesaplus.com/) compliant library. We
    built it to support how we are currently using promises. There is a test suite
    that will grow over time as we identify any short comings of this library.

## Inspired by   superagent-bluebird-promise
