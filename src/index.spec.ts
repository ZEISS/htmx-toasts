import {fixture, html} from '@open-wc/testing-helpers'
import {ExampleElement} from './index'
import {describe, it, expect, beforeEach} from 'vitest'

describe('example-element', () => {
  let element: ExampleElement

  beforeEach(async () => {
    element = await fixture(html`<example-element></example-element>`)
  })

  it('should render the element', () => {
    expect(element).toBeDefined()
  })
})
