export default function (inst) {
  let eventMap = {};

  function listenersFor(name) {
    return eventMap[name] || [];
  }

  function addListener(name, fn) {
    if (typeof fn === 'function') {
      let listeners = eventMap[name] = listenersFor(name);
      listeners.push(fn);
    }
    return inst;
  }

  function removeAllListeners() {
    eventMap = {};
  }

  function removeListener(name, fn) {
    let listeners = listenersFor(name);
    let index = listeners.indexOf(fn);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  }

  function removeListenersFor(name) {
    eventMap[name] = [];
  }

  function addOneListener(name, fn) {
    function oneFn() {
      fn.apply(inst, arguments);
      removeListener(name, oneFn);
    }
    return addListener(name, oneFn);
  }

  function trigger(name) {
    let args = Array.from(arguments).slice(1);
    let listeners = listenersFor(name);
    listeners.forEach((listener) => {
      listener.apply(inst, args);
    });
    return inst;
  }

  inst.off = (name, fn) => {
    if (name === '*') {
      removeAllListeners();
    } else if (fn) {
      removeListener(name, fn);
    } else {
      removeListenersFor(name);
    }
    return inst;
  };

  inst.on = addListener;
  inst.one = addOneListener;
  inst.trigger = trigger;

  return inst;
}
