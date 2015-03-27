compel.tag.register('loops','<h2>Loops</h2><h3>Logicless looping</h3><ul><li each="arrOfObjs" bind="name"></li></ul><h3>Each-in looping</h3><ul><li each="name in arr" bind="name"></li></ul><h3>Each key/value array looping</h3><ul><li each="key, val in arr"><span bind="key"></span> =&gt; <span bind="val"></span></li></ul><h3>Each key/value object looping</h3><ul><li each="key, val in obj"><span bind="key"></span> =&gt; <span bind="val"></span></li></ul><h3>Retreiving parent properties</h3><ul><li each="key, val in obj" bind="parent.obj[key]"></li></ul>',function(root,scope){"use strict";

scope.arrOfObjs = [{ name: "One" }, { name: "Two" }, { name: "Three" }];

scope.arr = ["One", "Two", "Three"];

scope.obj = {
  1: "One",
  2: "Two",
  3: "Three"
};

setTimeout(function () {
  scope.arrOfObjs.push({ name: "Four" });
  scope.arr.push("Four");
  scope.obj[4] = "Four";
  scope.update();
}, 2000);});