import {fixture, html} from '@open-wc/testing-helpers'
import {HTMXToastsElement} from './index'
import {describe, it, expect, beforeEach} from 'vitest'

describe('example-element', () => {
  let element: HTMXToastsElement

  beforeEach(async () => {
    element = await fixture(html`<htmx-toasts></htmx-toasts>`)
  })

  it('should render the element', () => {
    expect(element).toBeDefined()
  })
})
