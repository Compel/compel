**Warning!!! This is in mega Aplha stage. Feel free to muck around with it, but it's far from being production ready.**

Compel
======

Inspired by the delights of REACT, but not it's syntax.

Inspired by the syntax of Riot, but not by it's source.

Dive in, the water's lovely
---------------------------

Create a component...

```html
<!-- my-component.html -->
<my-new-component>

  <template>
    <h1>
      Hey there <span bind="name"></span>!
    </h1>
    <p>Nice to meet you</p>
  </template>

  <script>
    scope.name = scope.name || 'Randomer';
  </script>

</my-new-component>
```

Compile it...

```sh
$> compel my-component.html

my-component.html ==> my-component.js
```

Use it...

```html
<html>
  <head>
    <title>Using my new component</title>
  </head>
  <body>
    <my-new-component></my-new-component>
    <my-new-component name="Terry Wogan"></my-new-component>

    <script src="compel.js"></script>
    <!-- Include the compiled JS file -->
    <script src="my-new-component.js"></script>
    <script>compel.load()</script>
  </body>
</html>
```

Output looks something like:

```html
<html>
  <head>
    <title>Using my new component</title>
  </head>
  <body>
    <h1>Hey there Randomer!</h1>
    <p>Nice to meet you</p>

    <h1>Hey there Terry Wogan!</h1>
    <p>Nice to meet you</p>
  </body>
</html>
```

IE8
---

Yep, this will work in IE8 too. But you need to add an extra file, in the head
of your document and before the `compel.js` include.

```html
<html>
  <head>
    <script src="compel-ie8.js"></script>
  </head>
  <body>
    <script src="compel.js"></script>
    <script src="my-components.js"></script>
  </body>
</html>
```

Or... you can include each dependency yourself:

- ES5 Shim
- ES5 Sham
- EentListener Polyfill
- HTML5Shiv

You'll also need to declare all your components at in the head of your document
like so:

```html
<html>
  <head>
    <script src="ccompel-ie8.js"></script>
    <!--[if lte IE 8 ]>
      <script>
        html5.addElements('my-component, my-other-component');
      </script>
    <![endif]-->
  </head>
  <body>
    <my-component></my-component>
    <script src="compel.js"></script>
  </body>
</html>
```

CLI
---

```
  Usage: compel [options] source <destination>

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -o, --output [directory]  A directory to put the compiled output. Default is the same as the source
    --babel                   Compile component scripts with babel.js
    --html-minifier           Minifies HTML
```

Attributes
----------

All binding is used with attributes.

### `bind`

Bind a scope variable to the template:

```html
<template>
  <p bind="foo"></p>
</teamplte>
<script>
  scope.foo = 'bar';
</script>
```

```html
<!-- outputs -->
<p>bar</p>
```

### `each`

Bind an element to an array or key/value pairs:

#### Logic less looping

```html
<template>
  <ul>
    <li each="people">
      <span bind="name"></span> is <span bind="age"></span> years old
    </li>
  </ul>
</template>
<script>
  scope.people = [{name: 'Luke', age: 10}, {name: 'Lucy', age: 12}];
</script>
```

```html
<!-- outputs -->
<ul>
  <li>Luke is 10 years old</li>
  <li>Lucy is 12 years old</li>
</ul>
```

#### "In each" loops

```html
<template>
  <ul>
    <li each="person in people" bind="person"></li>
  </ul>
</template>
<script>
  scope.people = ['Luke', 'Lucy'];
</script>
```

```html
<!-- outputs -->
<ul>
  <li>Luke</li>
  <li>Lucy</li>
</ul>
```

#### "key, value in each" loops

```html
<template>
  <ul>
    <li each="name, age in people">
      <span bind="name"></span> is <span bind="age"></span> years old
    </li>
  </ul>
</template>
<script>
  scope.people = {John: 10, Lucy: 12};
</script>
```

```html
<!-- outputs -->
<ul>
  <li>Luke is 10 years old</li>
  <li>Lucy is 12 years old</li>
</ul>
```

### `bind-*`

Compel bloody anything! Any attribute beginning with `bind-` will bind the
expression and replace it's referencing attribute. E.g:

```html
<template>
  <p bind-class="someDynamicClassName" bind-style="someDynamicStyle"></p>
</template>
<script>
  scope.someDynamicClassName = 'my-class';
  scope.someDynamicStyle = 'color:red;';
</script>
```

```html
<!-- outputs -->
<p class="my-class" style="color:red;"></p>
```

### `transclude`

Transclusion is essentially using given HTML (a bit like an attribute) somewhere in a component.

Any script registered with the transcluded document will still be bound in the original declaration.

```html
<labeled-input>
  <template>
    <div class="form-group">
      <label bind-for="id" bind="label"></label>
      <div transclude></div>
    </div>
  </template>
</labeled-input>

<text-module>
  <template>
    <labeled-input id="text" label="Some text please">
      <input type="text" name="text" id="text" onchange="registerChange"/>
    </labeled-input>
  </template>
  <script>
    scope.registerChange = function (e) {
      // registering a change on the input
    };
  </script>
</text-module>
```

... would compile to ...

```html
<div class="form-group">
  <label for="text">Some text please</label>
  <div>
    <input type="text" name="text" id="text"/>
  </div>
</div>
```

Scope
-----

The `scope` is a property available to all component scripts that opens access of your variables
and functions to the template.

```html
<some-component>
  <template>
    <h1 bind="header"></h1>
  </template>
  <script>
    scope.header = 'I am a header';
  </script>
</some-component>
```

In the above component, the `h1` tag is bound to a variable `header`, assigned to the scope.
Let's try and use a function instead:

```html
<some-component>
  <template>
    <h1 bind="getHeader()"></h1>
  </template>
  <script>
    scope.getHeader = function () {
      return 'I am a header';
    };
  </script>
</some-component>
```

### Updating

To update the view at any given point, call the `update` method on the scope.

```html
<another-component>
  <template>
    <h1 bind="getHeader()"></h1>
  </template>
  <script>
    var name = 'you';

    scope.getHeader = function () {
      return 'Hello ' + name;
    };

    setTimeout(function () {
      name = 'John';
      scope.update()
    });
  </script>
</another-component>
```

Or, you can also pass a key/value pair to the update method as a shortcut:

```javascript
scope.update({name: 'John'});
```

Installation
------------

- Install the compiler with node: `npm i compel`.
