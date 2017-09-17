Decorator to add the component’s instance to the event handler’s arguments.

## Installation

```sh
npm install --save append-instance
```

## Usage

```js
import React, { Component } from 'react'
import { defaultPresenter, presentable } from 'presentable'
import appendInstance from 'append-instance'
import presentable from 'presentable'
import themeable from 'themeable'

@appendInstance
@presentable
class SomeComponent extends Component {}
// Or...
@appendInstance
@themeable
class SomeComponent extends Component {}

// The first parameter will be the normal one sent by React’s synthetic event,
// and the last one will be the component’s instance.
function handler(e, s) {
  // ...
}

<SomeComponent onClick={handler}/>
```
