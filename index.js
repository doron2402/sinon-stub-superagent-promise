function buildThenable() {
  var thenable = {
    then: function(onFulfill, onReject) {
      try {
        if (this.resolved && !this.rejected) {
          var returned;
          if (this.resolveFn) {
            returned = onFulfill(this.resolveFn());
            this.resolveFn = null;
          } else {
            returned = onFulfill(this.resolveValue);
          }

          // promise returned, return that for next handler in chain
          if (returned && returned.then) {
            return returned;
          }

          // update resolve value for next promise in chain
          this.resolveValue = returned;

          return this;
        }
      } catch(error) {
        if (error.constructor.name.match(/AssertionError/)) {
          throw error;
        }
        this.rejectValue = error;
        this.rejected = true;
      }

      if (this.rejected && onReject) {
        onReject(this.rejectValue);
        return this;
      }
      return this;
    },

    catch: function(onReject) {
      if (this.rejected) {
        try {
          onReject(this.rejectValue);
        } catch (e) {
          this.rejectValue = e;
        }
        return this;
      }
      return this;
    },

    finally: function(callback) {
      if (this.resolved || this.rejected) {
        callback();
      }
    }
  };

  var chainableMethods = [
    'field',
    'attach',
    'redirects',
    'agent',
    'set',
    'unset',
    'type',
    'accept',
    'query',
    'send',
    'buffer',
    'timeout',
    'clearTimeout',
    'parse',
    'redirect',
    'auth',
    'ca',
    'use',
    'end'
  ];
  chainableMethods.forEach(function(method) {
    thenable[method] = function() { return thenable; }
  });
  return thenable;
}

function setup(sinon) {
  function resolves(value) {
    this.thenable.resolved = true;
    this.thenable.rejected = false;
    this.thenable.resolveValue = value;
    return this;
  }

  function rejects(value) {
    this.thenable.rejected = true;
    this.thenable.resolved = false;
    this.thenable.rejectValue = value;
    return this;
  }

  function resolveFn(fn) {
    this.thenable.resolved = true;
    this.thenable.rejected = false;
    this.thenable.resolveFn = fn;
    return this;
  }

  sinon.stub.returnsPromise = function() {
    this.resolves = resolves;
    this.rejects = rejects;
    this.resolveFn = resolveFn;

    var thenable = buildThenable();
    this.thenable = thenable;
    this.returns(thenable);

    return this;
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = setup;
} else if (window.sinon) {
  setup(window.sinon);
}
