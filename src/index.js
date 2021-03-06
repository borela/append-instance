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

import partialRight from 'lodash.partialright'
import { Component } from 'react'
import { isPresentable } from 'presentable'

const HANDLER_IDENTIFIER = /^on[A-Z]\w*/

export function appendInstance(targetComponent:Class<Component<*>>) {
  if (!isPresentable(targetComponent))
    throw new Error(`Component “${targetComponent.construtor.name}”is not presentable.`)

  let prototype = targetComponent.prototype

  prototype.raiseEvent = function(event, ...args) {
    let handler = this.props[event]
    if (handler)
      handler(...args, this)
  }

  prototype.raiseEvents = function(events, ...args) {
    for (let event of events) {
      let handler = this.props[event]
      if (handler)
        handler(...args, this)
    }
  }

  let oldGetPresetanbleData = prototype.getPresentableData
  prototype.getPresentableData = function() {
    let result = oldGetPresetanbleData.call(this)
    let props = result.props

    for (let propName in props) {
      if (!HANDLER_IDENTIFIER.test(propName))
        continue
      let oldHandler = props[propName]
      props[propName] = partialRight(oldHandler, this)
    }

    return result
  }

  return targetComponent
}

export default appendInstance
