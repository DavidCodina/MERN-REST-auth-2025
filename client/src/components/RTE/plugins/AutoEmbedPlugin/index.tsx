import type { LexicalEditor } from 'lexical'

import {
  AutoEmbedOption,
  EmbedConfig,
  EmbedMatchResult,
  LexicalAutoEmbedPlugin,
  URL_MATCHER
} from '@lexical/react/LexicalAutoEmbedPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useMemo, useState, JSX } from 'react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import useModal from '../../hooks/useModal'

import { INSERT_YOUTUBE_COMMAND } from '../YouTubePlugin'

interface PlaygroundEmbedConfig extends EmbedConfig {
  // Human readable name of the embeded content e.g. Tweet or Google Map.
  contentName: string
  // Icon for display.
  icon?: JSX.Element
  // An example of a matching url https://twitter.com/jack/status/20
  exampleUrl: string
  // For extra searching.
  keywords: Array<string>
  // Embed a Figma Project.
  description?: string
  width: number
  // Overwrite the default insertNode from EmbedConfig.
  insertNode: (
    editor: LexicalEditor,
    result: EmbedMatchResult,
    width?: number
  ) => void
}

/* ========================================================================
                         
======================================================================== */

export const YoutubeEmbedConfig: PlaygroundEmbedConfig = {
  contentName: 'Youtube Video',
  exampleUrl: 'https://www.youtube.com/watch?v=abc123',
  icon: <i className='rte-icon-youtube' />,
  insertNode: (
    editor: LexicalEditor,
    result: EmbedMatchResult,
    width?: number
  ) => {
    const payload = {
      id: result.id,
      width: width || YoutubeEmbedConfig.width
    }
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, payload)
  },

  keywords: ['youtube', 'video'],

  // Determine if a given URL is a match and return url data.

  parseUrl: async (url: string) => {
    const match: any =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url)

    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null

    if (id !== null) {
      return {
        id,
        url
      }
    }

    return null
  },

  type: 'youtube-video',
  width: 500 // Default
}

export const EmbedConfigs = [YoutubeEmbedConfig]

/* ========================================================================
                         
======================================================================== */

function AutoEmbedMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option
}: {
  index: number
  isSelected: boolean
  onClick: () => void
  onMouseEnter: () => void
  option: AutoEmbedOption
}) {
  let className = 'rte-item'
  if (isSelected) {
    className += ' selected'
  }

  /* ======================
          return
  ====================== */

  return (
    <li // eslint-disable-line
      aria-selected={isSelected}
      className={className}
      id={'rte-typeahead-item-' + index}
      key={option.key}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={option.setRefElement}
      role='option'
      tabIndex={-1}
    >
      <span className='rte-text'>{option.title}</span>
    </li>
  )
}

/* ========================================================================
                         
======================================================================== */

function AutoEmbedMenu({
  options,
  selectedItemIndex,
  onOptionClick,
  onOptionMouseEnter
}: {
  selectedItemIndex: number | null
  onOptionClick: (option: AutoEmbedOption, index: number) => void
  onOptionMouseEnter: (index: number) => void
  options: Array<AutoEmbedOption>
}) {
  /* ======================
          return
  ====================== */
  return (
    <div className='rte-typeahead-popover'>
      <ul>
        {options.map((option: AutoEmbedOption, i: number) => (
          <AutoEmbedMenuItem
            index={i}
            isSelected={selectedItemIndex === i}
            key={option.key}
            onClick={() => onOptionClick(option, i)}
            onMouseEnter={() => onOptionMouseEnter(i)}
            option={option}
          />
        ))}
      </ul>
    </div>
  )
}

/* ========================================================================
                         
======================================================================== */

const debounce = (callback: (text: string) => void, delay: number) => {
  let timeoutId: number

  return (text: string) => {
    //^ This needs a check for window for Next.js
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback(text)
    }, delay)
  }
}

/* ========================================================================
                         
======================================================================== */
// This is somewhat of a misnomer. The AutoEmbedDialog actually only is used
// through manual insertion of the URL, not when we drop a URL into the editor.

export function AutoEmbedDialog({
  embedConfig,
  onClose
}: {
  embedConfig: PlaygroundEmbedConfig
  onClose: () => void
}): JSX.Element {
  const [editor] = useLexicalComposerContext()

  const [text, setText] = useState('')
  const [width, setWidth] = useState(() => {
    if (typeof embedConfig.width === 'number') {
      return embedConfig.width.toString()
    }
    return '500'
  })

  const [embedResult, setEmbedResult] = useState<EmbedMatchResult | null>(null)

  /* ======================
        validateText()
  ====================== */
  //^ What does this do?

  const validateText = useMemo(
    () =>
      debounce((inputText: string) => {
        const urlMatch = URL_MATCHER.exec(inputText)
        if (embedConfig !== null && inputText !== null && urlMatch !== null) {
          Promise.resolve(embedConfig.parseUrl(inputText))
            .then((parseResult) => {
              setEmbedResult(parseResult)
              return parseResult
            })
            .catch((err) => err)
        } else if (embedResult !== null) {
          setEmbedResult(null)
        }
      }, 200),
    [embedConfig, embedResult]
  )

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='rte-form-group'>
        <input
          autoComplete='off'
          className='rte-form-control rte-form-control-sm'
          onChange={(e) => {
            const { value } = e.target
            setText(value)
            validateText(value)
          }}
          placeholder={embedConfig.exampleUrl}
          spellCheck={false}
          type='text'
          value={text}
        />
      </div>

      <div className='rte-form-group'>
        <label // eslint-disable-line
          className='rte-form-label'
        >
          Width
        </label>

        <input
          autoComplete='off'
          className='rte-form-control rte-form-control-sm'
          onKeyDown={(e) => {
            if (['e', 'E', '-', '+', '.'].includes(e.key)) {
              e.preventDefault()
              e.stopPropagation()
              return
            }
          }}
          onChange={(e) => {
            setWidth(e.target.value)
          }}
          placeholder='The initial width of the image...'
          type='number'
          value={width}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
          marginTop: 20
        }}
      >
        <button
          className='rte-button'
          disabled={!embedResult}
          onClick={() => {
            let widthAsNumber =
              width.trim() !== '' ? parseInt(width) : undefined

            widthAsNumber =
              typeof widthAsNumber === 'number' && !isNaN(widthAsNumber)
                ? widthAsNumber
                : undefined

            if (embedResult !== null) {
              embedConfig.insertNode(editor, embedResult, widthAsNumber)
              onClose()
            }
          }}
          style={{ minWidth: 150 }}
          type='button'
        >
          Embed
        </button>
      </div>
    </>
  )
}

/* ========================================================================
                         
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The AutoEmbedPlugin in Lexical is designed to automatically embed content from URLs into the text editor.
// The AutoEmbedPlugin detects URLs in the text editor and automatically converts them into embedded content.
// This can include videos, images, tweets, and other rich media content. The plugin uses a set of predefined
// matchers to identify the type of content and then renders the appropriate embed.
//
// For example, when you drop a youtube URL: 'https://www.youtube.com/watch?v=SyeI43BeR54' in the edior,
// a modal will appear asking if you want to embed the video.
//
///////////////////////////////////////////////////////////////////////////

export default function AutoEmbedPlugin(): JSX.Element {
  const [modal, showModal] = useModal()

  /* ======================
      openEmbedModal()
  ====================== */

  const openEmbedModal = (embedConfig: PlaygroundEmbedConfig) => {
    showModal(`Embed ${embedConfig.contentName}`, (onClose) => (
      <AutoEmbedDialog embedConfig={embedConfig} onClose={onClose} />
    ))
  }

  /* ======================
      getMenuOptions()
  ====================== */

  const getMenuOptions = (
    activeEmbedConfig: PlaygroundEmbedConfig,
    embedFn: () => void,
    dismissFn: () => void
  ) => {
    return [
      new AutoEmbedOption('Dismiss', {
        onSelect: dismissFn
      }),
      new AutoEmbedOption(`Embed ${activeEmbedConfig.contentName}`, {
        onSelect: embedFn
      })
    ]
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {modal}
      <LexicalAutoEmbedPlugin<PlaygroundEmbedConfig>
        embedConfigs={EmbedConfigs}
        onOpenEmbedModalForConfig={openEmbedModal}
        getMenuOptions={getMenuOptions}
        menuRenderFn={(
          anchorElementRef,
          {
            selectedIndex,
            options,
            selectOptionAndCleanUp,
            setHighlightedIndex
          }
        ) =>
          anchorElementRef.current
            ? ReactDOM.createPortal(
                <div
                  className='rte-typeahead-popover rte-auto-embed-menu'
                  // https://github.com/facebook/lexical/commit/3d45e64b23eb529f98a1d39ddc982f111048d033
                  style={{
                    marginLeft: `${Math.max(
                      parseFloat(anchorElementRef.current.style.width) - 200,
                      0
                    )}px`,
                    width: 200
                  }}
                >
                  <AutoEmbedMenu
                    onOptionClick={(option: AutoEmbedOption, index: number) => {
                      setHighlightedIndex(index)
                      selectOptionAndCleanUp(option)
                    }}
                    onOptionMouseEnter={(index: number) => {
                      setHighlightedIndex(index)
                    }}
                    options={options}
                    selectedItemIndex={selectedIndex}
                  />
                </div>,
                anchorElementRef.current
              )
            : null
        }
      />
    </>
  )
}
