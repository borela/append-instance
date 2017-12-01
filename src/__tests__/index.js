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

import Adapter from 'enzyme-adapter-react-16'
import appendInstance from '..'
import presentable, { defaultPresenter } from 'presentable'
import React, { Component } from 'react'
import themeable from 'themeable'
import { configure, shallow } from 'enzyme'

configure({ adapter: new Adapter })

const ON_D_ARG = { a: 1, b: 2, c: 3 }
const ARG = { x: 123, z: 42 }

class SomePresenter extends Component {
  render() {
    let { props: { onD }} = this.props.presentable
    if (onD)
      onD(ON_D_ARG)
    return <div>Ctrine!</div>
  }
}

@presentable
@defaultPresenter(SomePresenter)
class SomePresentableComponent extends Component {}

@themeable
@defaultPresenter(SomePresenter)
class SomeThemeableComponent extends Component {}

let DecoratedPresentable = appendInstance(SomePresentableComponent)
let DecoratedThemeable = appendInstance(SomeThemeableComponent)

describe('Decorator “appendInstance” applied on presentable “SomeComponent”', () => {
  it('has the same constructor', () => {
    const WRAPPER = shallow(<DecoratedPresentable/>)
    const INSTANCE = WRAPPER.instance()
    expect(INSTANCE instanceof SomePresentableComponent).toBe(true)
    expect(Object.getPrototypeOf(INSTANCE).constructor).toBe(SomePresentableComponent)
  })

  it('has a method to raise an event', () => {
    let handlerA = jest.fn()
    const WRAPPER = shallow(<SomePresentableComponent onA={handlerA}/>)
    const COMPONENT = WRAPPER.instance()
    COMPONENT.raiseEvent('onA', ARG)
    expect(handlerA).toHaveBeenCalledTimes(1)
    expect(handlerA).toBeCalledWith(ARG, COMPONENT)
  })

  it('has a method to raise multiple events', () => {
    let handlerA = jest.fn()
    let handlerB = jest.fn()
    let handlerC = jest.fn()

    const WRAPPER = shallow(
      <SomePresentableComponent
        onA={handlerA}
        onB={handlerB}
        onC={handlerC}
      />
    )

    const COMPONENT = WRAPPER.instance()
    COMPONENT.raiseEvents([ 'onA', 'onB', 'onC' ], ARG)

    expect(handlerA).toHaveBeenCalledTimes(1)
    expect(handlerA).toBeCalledWith(ARG, COMPONENT)

    expect(handlerB).toHaveBeenCalledTimes(1)
    expect(handlerB).toBeCalledWith(ARG, COMPONENT)

    expect(handlerC).toHaveBeenCalledTimes(1)
    expect(handlerC).toBeCalledWith(ARG, COMPONENT)
  })

  it('appends the component’s instance to the event handlers passed to the presenter', () => {
    let handlerD = jest.fn()
    const WRAPPER = shallow(<SomePresentableComponent onD={handlerD}/>)
    const COMPONENT = WRAPPER.instance()
    // The handler will be called in the presenter’s render method.
    WRAPPER.dive()
    expect(handlerD).toHaveBeenCalledTimes(1)
    expect(handlerD).toBeCalledWith(ON_D_ARG, COMPONENT)
  })
})

describe('Decorator “appendInstance” applied on themeable “SomeComponent”', () => {
  it('has the same constructor', () => {
    const WRAPPER = shallow(<DecoratedThemeable/>)
    const INSTANCE = WRAPPER.instance()
    expect(INSTANCE instanceof SomeThemeableComponent).toBe(true)
    expect(Object.getPrototypeOf(INSTANCE).constructor).toBe(SomeThemeableComponent)
  })

  it('has a method to raise an event', () => {
    let handlerA = jest.fn()
    const WRAPPER = shallow(<SomeThemeableComponent onA={handlerA}/>)
    const COMPONENT = WRAPPER.instance()
    COMPONENT.raiseEvent('onA', ARG)
    expect(handlerA).toHaveBeenCalledTimes(1)
    expect(handlerA).toBeCalledWith(ARG, COMPONENT)
  })

  it('has a method to raise multiple events', () => {
    let handlerA = jest.fn()
    let handlerB = jest.fn()
    let handlerC = jest.fn()

    const WRAPPER = shallow(
      <SomeThemeableComponent
        onA={handlerA}
        onB={handlerB}
        onC={handlerC}
      />
    )
    const COMPONENT = WRAPPER.instance()
    COMPONENT.raiseEvents([ 'onA', 'onB', 'onC' ], ARG)

    expect(handlerA).toHaveBeenCalledTimes(1)
    expect(handlerA).toBeCalledWith(ARG, COMPONENT)

    expect(handlerB).toHaveBeenCalledTimes(1)
    expect(handlerB).toBeCalledWith(ARG, COMPONENT)

    expect(handlerC).toHaveBeenCalledTimes(1)
    expect(handlerC).toBeCalledWith(ARG, COMPONENT)
  })

  it('appends the component’s instance to the event handlers passed to the presenter', () => {
    let handlerD = jest.fn()
    const WRAPPER = shallow(<SomeThemeableComponent onD={handlerD}/>)
    const COMPONENT = WRAPPER.instance()
    // The handler will be called in the presenter’s render method.
    WRAPPER.dive()
    expect(handlerD).toHaveBeenCalledTimes(1)
    expect(handlerD).toBeCalledWith(ON_D_ARG, COMPONENT)
  })
})
