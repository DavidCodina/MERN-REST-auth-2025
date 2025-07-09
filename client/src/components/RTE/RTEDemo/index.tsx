'use client'

import { useEffect, useState, useRef } from 'react'
import DOMPurify from 'dompurify'
import { RTE } from '../'

const defaultValue1 = `<p dir="ltr"><span style="white-space: pre-wrap;">Hello. My name is </span><b><strong class="editor-theme-textBold" style="white-space: pre-wrap;">David.</strong></b></p>`
const _defaultValue2 = `<p dir="ltr">This is the updated 'default' value...</p>`

const _defaultValue3 = `<pre class="editor-theme-code" spellcheck="false" data-language="javascript" data-highlight-language="javascript" data-gutter="1
2
3"><span class="editor-theme-tokenAttr" style="white-space: pre-wrap;">const</span><span style="white-space: pre-wrap;"> </span><span style="white-space: pre-wrap;">logMessage</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">=</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">(</span><span style="white-space: pre-wrap;">message</span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">:</span><span style="white-space: pre-wrap;"> string</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">)</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">=&gt;</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">{</span><br><span style="white-space: pre-wrap;">  console</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">.</span><span class="editor-theme-tokenFunction" style="white-space: pre-wrap;">log</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">(</span><span style="white-space: pre-wrap;">message</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">)</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">;</span><br><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">}</span></pre>`

// This version demonstrates that <code> will still be transformed correctly.
const _defaultValue4 = `<code class="editor-theme-code" spellcheck="false" data-language="javascript" data-highlight-language="javascript" data-gutter="1
2
3"><span class="editor-theme-tokenAttr" style="white-space: pre-wrap;">const</span><span style="white-space: pre-wrap;"> </span><span style="white-space: pre-wrap;">logMessage</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">=</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">(</span><span style="white-space: pre-wrap;">message</span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">:</span><span style="white-space: pre-wrap;"> string</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">)</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">=&gt;</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">{</span><br><span style="white-space: pre-wrap;">  console</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">.</span><span class="editor-theme-tokenFunction" style="white-space: pre-wrap;">log</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">(</span><span style="white-space: pre-wrap;">message</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">)</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">;</span><br><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">}</span></code>`

const _defaultSquare = `<p class="editor-theme-paragraph"><span contenteditable="false" style="display: inline-block; width: 100px; height: 100px; background-color: rgb(132, 204, 22);"></span></p><p class="editor-theme-paragraph"><br></p>`

const defaultYoutube = `
<div 
  data-lexical-youtube-wrapper="true"
  class="editor-theme-embedBlock"
  style="text-align: center;"
>
  <iframe 
    data-lexical-youtube="u8nuT1rDB7o"
    src="https://www.youtube-nocookie.com/embed/u8nuT1rDB7o" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen="true" title="YouTube video"
    style="aspect-ratio: 16 / 9; width: 800px; max-width: 100%;"
  ></iframe>
</div>
<p class="editor-theme-paragraph"><br></p>
`

const _defaultH4Indent = `<h4 class="editor-theme-h4" dir="ltr" style="padding-inline-start: 120px;"><span style="white-space: pre-wrap;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</span></h4>`

// Lexical, by default, does not execute scripts embedded in the content.
// https://github.com/facebook/lexical/discussions/4534
// However, they indicate that it's ultimately the user's responsibility to
// sanitize content.

/* ========================================================================
                         
======================================================================== */

export const RTEDemo = () => {
  const [initialValue, setInitialValue] = useState<string>(defaultValue1)
  const [value, setValue] = useState<string>(initialValue)

  // There is some concern that DOMPurify.sanitize may not work with Next.js,
  // but I think it's fine in client components.
  const sanitizedValue = DOMPurify.sanitize(value, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['iframe', 'a'],
    ADD_ATTR: [
      'allow',
      'allowfullscreen',
      'frameborder',
      'scrolling',
      'target',
      'title'
    ],
    KEEP_CONTENT: false
  })

  const apiRef = useRef<React.Ref<unknown>>(null)

  useEffect(() => {
    setTimeout(() => {
      setInitialValue(defaultYoutube)
    }, 800)
  }, [])

  return (
    <>
      <div className='mb-6 flex justify-center gap-4'>
        <button
          className='btn-red btn-sm'
          onClick={() => {
            const api = apiRef.current
            if (api === null) {
              return
            }

            if (
              typeof api === 'object' &&
              'clear' in api &&
              typeof api.clear === 'function'
            ) {
              api.clear()
            }
          }}
        >
          Clear Editor
        </button>

        <button
          className='btn-blue btn-sm'
          onClick={() => {
            const api = apiRef.current
            if (api === null) {
              return
            }

            if (
              typeof api === 'object' &&
              'focus' in api &&
              typeof api.focus === 'function'
            ) {
              api.focus()
            }
          }}
        >
          Focus Editor
        </button>
      </div>

      <RTE
        apiRef={apiRef}
        initialValue={initialValue}
        namespace='TestEditor'
        onChange={(values) => {
          // console.log('\n\n', values)
          setValue(values.html)
        }}
        placeholder='Say something genius!'
      />

      <br />
      <br />

      <h3 className='text-xl leading-none text-blue-500'>
        dangerouslySetInnerHTML:
      </h3>

      <div
        className='mb-8 rounded-lg border border-neutral-400 bg-white p-4'
        dangerouslySetInnerHTML={{
          __html: sanitizedValue
        }}
      />

      <h3 className='text-xl leading-none text-blue-500'>values.html:</h3>

      <div className='mb-8 rounded-lg border border-neutral-400 bg-white p-4'>
        {value}
      </div>
    </>
  )
}
