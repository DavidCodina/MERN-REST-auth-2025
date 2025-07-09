import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohavetextcontent
// toHaveTextContent(text: string | RegExp, options?: {normalizeWhitespace: boolean})
//
// This allows you to check whether the given node has a text content or not.
// This supports elements, but also text nodes and fragments.
//
// When a string argument is passed through, it will perform a partial case-sensitive
// match to the node content.
//
// To perform a case-insensitive match, you can use a RegExp with the /i modifier.
//
// If you want to match the whole content, you can use a RegExp to do it.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveTextContent...', () => {
  test('should pass', () => {
    render(
      <>
        <span data-testid='text-content'>Text Content</span>
      </>
    )

    const element = screen.getByTestId('text-content')

    expect(element).toHaveTextContent('Content')
    expect(element).toHaveTextContent(/^Text Content$/) // to match the whole content
    expect(element).toHaveTextContent(/content$/i) // to use case-insensitive match
    expect(element).not.toHaveTextContent('content')
  })
})
