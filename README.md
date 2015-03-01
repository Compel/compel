Compel
======

Inspired by the delights of REACT, but not it's syntax.

Inspired by the syntax of Riot, but not by it's source.

Dive in, the water's lovely
---------------------------

Create a component...

```html
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

Compile and use it...

```html
<html>
  <head>
    <title>Using my new component</title>
  </head>
  <body>
    <my-new-component></my-new-component>
    <my-new-component name="Terry Wogan"></my-new-component>

    <script src="compel.js"></script>
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

### `compel-*`

Compel bloody anything! Any attribute beginning with `compel-` will bind the
expression and replace it's referencing attribute. E.g:

```html
<template>
  <p compel-class="someDynamicClassName" compel-style="someDynamicStyle"></p>
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

Installation
------------

- Install the compiler with node: `npm i compel`.
- ...
