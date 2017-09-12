// Licensed under the Apache License, Version 2.0 (the “License”); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

import appendInstance from '..'
import React, { Component } from 'react'
import themeable from 'themeable'
import { defaultPresenter } from 'presentable'
import { shallow } from 'enzyme'

class SomePresenter extends Component {
  render() {
    let { instance, props: { onD } } = this.props.presentable
    if (onD)
      onD({})
    return <div>Ctrine!</div>
  }
}

@themeable('...')
@defaultPresenter(SomePresenter)
class SomeComponent extends Component {}

let DecoratedComponent = appendInstance(SomeComponent)

describe('Decorator “appendInstance” applied on “SomeComponent”', () => {
  it('has the same constructor', () => {
    const WRAPPER = shallow(<DecoratedComponent/>)
    const INSTANCE = WRAPPER.instance()
    expect(INSTANCE instanceof SomeComponent)
      .toBe(true)
    expect(Object.getPrototypeOf(INSTANCE).constructor)
      .toBe(SomeComponent)
  })

  it('has a method to raise an event', () => {
    let handlerA = jest.fn()
    const WRAPPER = shallow(<SomeComponent onA={handlerA}/>)
    const COMPONENT = WRAPPER.instance()
    COMPONENT.raiseEvent('onA', {})
    expect(handlerA).toHaveBeenCalledTimes(1)
    expect(handlerA).toBeCalledWith({}, COMPONENT)
  })

  it('has a method to raise multiple events', () => {
    let handlerA = jest.fn()
    let handlerB = jest.fn()
    let handlerC = jest.fn()

    const WRAPPER = shallow(
      <SomeComponent
        onA={handlerA}
        onB={handlerB}
        onC={handlerC}
      />
    )
    const COMPONENT = WRAPPER.instance()
    COMPONENT.raiseEvents(['onA', 'onB', 'onC'], {})

    expect(handlerA).toHaveBeenCalledTimes(1)
    expect(handlerA).toBeCalledWith({}, COMPONENT)

    expect(handlerB).toHaveBeenCalledTimes(1)
    expect(handlerB).toBeCalledWith({}, COMPONENT)

    expect(handlerC).toHaveBeenCalledTimes(1)
    expect(handlerC).toBeCalledWith({}, COMPONENT)
  })

  it('appends the component’s instance to the event handlers passed to the presenter', () => {
    let handlerD = jest.fn()
    const WRAPPER = shallow(<SomeComponent onD={handlerD}/>)
    const COMPONENT = WRAPPER.instance()
    // The handler will be called in the presenter’s render method.
    const RENDERED_PRESENTER = WRAPPER.dive()
    expect(handlerD).toHaveBeenCalledTimes(1)
    expect(handlerD).toBeCalledWith({}, COMPONENT)
  })
})
