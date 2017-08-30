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

@presentable
@themeable
//
@appendInstance
class SomeComponent extends Component {}
```
