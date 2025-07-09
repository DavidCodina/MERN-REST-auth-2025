// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx

import './ToolbarPlugin.css'
import { Dispatch, useCallback, useEffect, useState, JSX } from 'react'

import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName
} from '@lexical/code'

import {
  $isListNode,
  ListNode
  // Previous version used REMOVE_LIST_COMMAND, but now we're using formatParagraph()
  // instead of: editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
} from '@lexical/list'

import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'

import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin'

import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'

// Previously, there was no way to hr property for theming the lexical HorizontalRulePlugin.
// Consequently, I previously used the custom HorizontalRulePlugin and HorizontalRuleNode.
// However, they have since updated that plugin, so the custom one is no longer needed.
// import { HorizontalRulePlugin } from './plugins/HorizontalRulePlugin'
// import { INSERT_HORIZONTAL_RULE_COMMAND } from '../../nodes/HorizontalRuleNode'

import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text'

import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText
} from '@lexical/selection'

import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister
} from '@lexical/utils'

import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  ElementFormatType,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from 'lexical'

import useModal from '../../hooks/useModal'
import DropDown, { DropDownItem } from './Dropdown'
import DropdownColorPicker from './DropdownColorPicker'

import { getSelectedNode } from '../../utils/getSelectedNode'
import { sanitizeUrl } from '../../utils/url'
import { EmbedConfigs } from '../AutoEmbedPlugin'

import { INSERT_SQUARE_COMMAND } from '../../nodes/SquareNode'

///////////////////////////////////////////////////////////////////////////
//
// The logic for ImagesPlugin, ImageNode, ImageComponent and ImageResizer is
// very complex. It was taken from the Lexical playground example, then
// simplified by removing all code related to captions. Thus it still retains
// resizing and centering feature. Nonetheless, it's not something that I really
// understand, but it works.
//
// For a much more basic example, see here:
//
//   https://codesandbox.io/s/lexical-image-plugin-example-iy2bc5?file=/src/plugins/ImageToolbar.tsx:1016-1134
//
//
///////////////////////////////////////////////////////////////////////////

import { InsertImageDialog } from '../ImagesPlugin'
import { InsertInlineImageDialog } from '../InlineImagePlugin'

import { blockTypeToBlockName } from './blockTypeToBlockName'
import { FontFamilyDropDown } from './FontFamilyDropDown'
import { FontSizeDropDown } from './FontSizeDropDown'
import FontSize from './FontSize'
import { AdditionalFormatDropDown } from './AdditionalFormatDropDown'

import { BlockFormatDropDown } from './BlockFormatDropDown'
import { ElementFormatDropDown } from './ElementFormatDropDown'
import { Divider } from './Divider'

/* ======================

====================== */

// eslint-disable-next-line
const rootTypeToRootName = {
  root: 'Root',
  table: 'Table'
}

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = []

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName])
  }

  return options
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions()

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active rte-dropdown-item-active'
  } else {
    return ''
  }
}

// The official example does this, but I did it all locally.
// import { IS_APPLE } from 'shared/environment'
export const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'

const IS_APPLE: boolean =
  CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

const defaultFontSize = 16

/* ========================================================================
                            ToolbarPlugin()            
======================================================================== */

export const ToolbarPlugin = ({
  setIsLinkEditMode
}: {
  setIsLinkEditMode: Dispatch<boolean>
}): JSX.Element => {
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>('paragraph')

  // The rootType seems to be related to the implementation of tables,
  // but that Lexical feature may still be experimental.
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>('root')

  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  )

  const [fontSize, setFontSize] = useState<string>(`${defaultFontSize}px`)

  const [fontColor, setFontColor] = useState<string>('#000')
  const [bgColor, setBgColor] = useState<string>('#fff')
  const [fontFamily, setFontFamily] = useState<string>('Arial')
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left')
  const [isLink, setIsLink] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isSubscript, setIsSubscript] = useState(false)
  const [isSuperscript, setIsSuperscript] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [modal, showModal] = useModal()
  const [isRTL, setIsRTL] = useState(false)

  const [codeLanguage, setCodeLanguage] = useState<string>('')
  const [isEditable, setIsEditable] = useState(() => editor.isEditable())

  /* ======================
      $updateToolbar()
  ====================== */
  // Called in useEffect() 1 & 2.
  // In 2 it is registered as a listener, which then
  // makes it trigger whenever the editor is clicked, a new selection is chosen, etc.

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = activeEditor.getElementByKey(elementKey)

      // Update text format
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsSubscript(selection.hasFormat('subscript'))
      setIsSuperscript(selection.hasFormat('superscript'))
      setIsCode(selection.hasFormat('code'))
      //# Not really sure how this works.
      //# Maybe the start/end alignment options are what control this...
      setIsRTL($isParentElementRTL(selection))

      // Update links
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }

      setRootType('root')

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey)
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          )
          const type = parentList
            ? parentList.getListType()
            : element.getListType()

          setBlockType(type)
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType()

          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName)
          }

          //^ Gotcha: This is necessary when backspacing on a 'code' blockType
          //^ in order to switch the 'code' blockType back to a 'paragraph'.
          if (type === 'custom-paragraph') {
            setBlockType('paragraph')
          }

          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ''
            )
            return
          }
        }
      }
      // Handle buttons

      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000')
      )
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff'
        )
      )
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
      )

      let matchingParent
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        )
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left'
      )
    }

    if ($isRangeSelection(selection)) {
      setFontSize(
        $getSelectionStyleValueForProperty(
          selection,
          'font-size',
          `${defaultFontSize}px`
        )
      )
    }
  }, [activeEditor])

  /* ======================
        useEffect() 1
  ====================== */
  // As far as I can tell, this ony runs on mount.

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor)
        $updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, $updateToolbar])

  /* ======================
        useEffect() 2
  ====================== */

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar()
    })
  }, [activeEditor, $updateToolbar])

  /* ======================
        useEffect() 3 
  ====================== */
  // This gets called on mount.
  // It registers $updateToolbar() listener as well as undo/redo commands.

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable)
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      )
    )
  }, [$updateToolbar, activeEditor, editor])

  /* ======================
        useEffect() 4 
  ====================== */

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload
        const { code, ctrlKey, metaKey } = event

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault()
          let url: string | null
          if (!isLink) {
            setIsLinkEditMode(true)
            url = sanitizeUrl('https://')
          } else {
            setIsLinkEditMode(false)
            url = null
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
        }
        return false
      },
      COMMAND_PRIORITY_NORMAL
    )
  }, [activeEditor, isLink, setIsLinkEditMode])

  /* ======================
        applyStyleText() 
  ====================== */

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection()
          if (selection !== null) {
            $patchStyleText(selection, styles)
          }
        },
        skipHistoryStack ? { tag: 'historic' } : {}
      )
    },
    [activeEditor]
  )

  /* ======================
      clearFormatting() 
  ====================== */

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor
        const focus = selection.focus
        const nodes = selection.getNodes()
        const extractedNodes = selection.extract()

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode
            }
            /**
             * If the selected text has one format applied
             * selecting a portion of the text, could
             * clear the format to the wrong portion of the text.
             *
             * The cleared text is based on the length of the selected text.
             */
            // We need this in case the selected text only has one format
            const extractedTextNode = extractedNodes[0]
            if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
              textNode = extractedTextNode
            }

            if (textNode.__style !== '') {
              textNode.setStyle('')
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0)
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('')
            }
            node = textNode
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true)
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('')
          }
        })
      }
    })
  }, [activeEditor])

  /* ======================
     onFontColorSelect() .
  ====================== */

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack)
    },
    [applyStyleText]
  )

  /* ======================
      onBgColorSelect() 
  ====================== */

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ 'background-color': value }, skipHistoryStack)
    },
    [applyStyleText]
  )

  /* ======================
        insertLink() 
  ====================== */

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true)
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'))
    } else {
      setIsLinkEditMode(false)
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [activeEditor, isLink, setIsLinkEditMode])

  /* ======================
    onCodeLanguageSelect()
  ====================== */

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey)
          if ($isCodeNode(node)) {
            node.setLanguage(value)
          }
        }
      })
    },
    [activeEditor, selectedElementKey]
  )

  /* ======================
          return
  ====================== */

  return (
    <div
      className='rte-toolbar'
      style={{
        backgroundColor: 'rgb(245,245,245)',
        borderTopLeftRadius: 'inherit',
        borderTopRightRadius: 'inherit',
        borderBottom: '1px solid #ccc',
        // overflow: 'auto',
        flexWrap: 'wrap',
        padding: 5,
        width: '100%'
      }}
    >
      {/* Demo implementation of SquarePlugin  */}

      <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(INSERT_SQUARE_COMMAND, undefined)
        }}
        title={'Insert Square'}
        style={{
          alignSelf: 'center',
          backgroundColor: 'rgb(132, 204, 22)',
          border: '1px solid #65a30d',
          borderRadius: 5,
          color: 'white',
          fontSize: 12,
          fontWeight: 'bold',
          lineHeight: 1,
          padding: '4px 6px',
          userSelect: 'none'
        }}
        type='button'
        aria-label='Insert Square'
      >
        Square
      </button>

      {/* =====================
              undo/redo 
      ===================== */}

      <button
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined)
        }}
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        type='button'
        className='rte-toolbar-item'
        aria-label='Undo'
      >
        <i className='format rte-icon-undo' />
      </button>

      <button
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined)
        }}
        title={IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)'}
        type='button'
        className='rte-toolbar-item'
        aria-label='Redo'
      >
        <i className='format rte-icon-redo' />
      </button>
      <Divider />

      {/* =====================
          BlockFormatDropDown
      ===================== */}

      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            rootType={rootType}
            editor={activeEditor}
          />
          <Divider />
        </>
      )}

      {/* =============================================================================== */}

      {blockType === 'code' ? (
        <DropDown
          disabled={!isEditable}
          buttonClassName='rte-toolbar-item rte-code-language'
          buttonLabel={getLanguageFriendlyName(codeLanguage)}
          buttonAriaLabel='Select language'
        >
          {/* Map out the menu items for the selected code language  */}
          {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
            return (
              <DropDownItem
                className={`rte-item ${dropDownActiveClass(
                  value === codeLanguage
                )}`}
                onClick={() => onCodeLanguageSelect(value)}
                key={value}
              >
                <span className='rte-text'>{name}</span>
              </DropDownItem>
            )
          })}
        </DropDown>
      ) : (
        <>
          <FontFamilyDropDown
            disabled={!isEditable}
            value={fontFamily}
            editor={activeEditor}
            title='Font family formatting options'
          />

          {/* The FontSizeDropDown is more or less redundant with the FontSize component below. 
          I'm leaving it in for now, but in production you might want to comment out one of them.
          Note: This component is not width restricted so as the value changes, there may be a little
          layout shift. */}

          <FontSizeDropDown
            disabled={!isEditable}
            value={fontSize}
            editor={editor}
            title='Font size formatting options'
          />

          <Divider />

          <FontSize
            selectionFontSize={fontSize.slice(0, -2)}
            editor={activeEditor}
            disabled={!isEditable}
          />

          <Divider />

          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
            }}
            className={'rte-toolbar-item ' + (isBold ? 'active' : '')}
            title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
            type='button'
            aria-label={`Format text as bold. Shortcut: ${
              IS_APPLE ? '⌘B' : 'Ctrl+B'
            }`}
          >
            <i className='format rte-icon-bold' />
          </button>

          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
            }}
            className={'rte-toolbar-item ' + (isItalic ? 'active' : '')}
            title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
            type='button'
            aria-label={`Format text as italics. Shortcut: ${
              IS_APPLE ? '⌘I' : 'Ctrl+I'
            }`}
          >
            <i className='format rte-icon-italic' />
          </button>

          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
            }}
            className={'rte-toolbar-item ' + (isUnderline ? 'active' : '')}
            title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
            type='button'
            aria-label={`Format text to underlined. Shortcut: ${
              IS_APPLE ? '⌘U' : 'Ctrl+U'
            }`}
          >
            <i className='format rte-icon-underline' />
          </button>

          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
            }}
            className={'rte-toolbar-item ' + (isCode ? 'active' : '')}
            title='Insert code block'
            type='button'
            aria-label='Insert code block'
          >
            <i className='format rte-icon-code' />
          </button>

          <button
            disabled={!isEditable}
            onClick={insertLink}
            className={'rte-toolbar-item ' + (isLink ? 'active' : '')}
            aria-label='Insert link'
            title='Insert link'
            type='button'
          >
            <i className='format rte-icon-link' />
          </button>

          <DropdownColorPicker
            disabled={!isEditable}
            buttonClassName='rte-toolbar-item color-picker'
            buttonAriaLabel='Formatting text color'
            buttonIconClassName='rte-icon-font-color'
            color={fontColor}
            onChange={onFontColorSelect}
            title='text color'
          />

          <DropdownColorPicker
            disabled={!isEditable}
            buttonClassName='rte-toolbar-item color-picker'
            buttonAriaLabel='Formatting background color'
            buttonIconClassName='rte-icon-bg-color'
            color={bgColor}
            onChange={onBgColorSelect}
            title='bg color'
          />

          <AdditionalFormatDropDown
            activeEditor={activeEditor}
            clearFormatting={clearFormatting}
            isEditable={isEditable}
            isStrikethrough={isStrikethrough}
            isSubscript={isSubscript}
            isSuperscript={isSuperscript}
          />

          <Divider />

          {/* 
          //^ Why is this not abstracted into it's own component?
          */}

          <DropDown
            disabled={!isEditable}
            buttonClassName='rte-toolbar-item'
            buttonLabel='Insert'
            buttonAriaLabel='Insert specialized editor node'
            buttonIconClassName='rte-icon-plus'
            title='Insert specialized editor node'
          >
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  INSERT_HORIZONTAL_RULE_COMMAND,
                  undefined
                )
              }}
              className='rte-item'
            >
              <i className='rte-icon-horizontal-rule' />
              <span className='rte-text'>Horizontal Rule</span>
            </DropDownItem>

            <DropDownItem
              onClick={() => {
                showModal('Insert Image', (onClose) => (
                  <InsertImageDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ))
              }}
              className='rte-item'
            >
              <i className='rte-icon-image' />
              <span className='rte-text'>Image</span>
            </DropDownItem>

            <DropDownItem
              onClick={() => {
                showModal('Insert Inline Image', (onClose) => (
                  <InsertInlineImageDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ))
              }}
              className='rte-item'
            >
              <i className='rte-icon-image' />
              <span className='rte-text'>Inline Image</span>
            </DropDownItem>

            {EmbedConfigs.map((embedConfig) => (
              <DropDownItem
                key={embedConfig.type}
                onClick={() => {
                  activeEditor.dispatchCommand(
                    INSERT_EMBED_COMMAND,
                    embedConfig.type
                  )
                }}
                className='rte-item'
              >
                {embedConfig.icon}
                <span className='rte-text'>{embedConfig.contentName}</span>
              </DropDownItem>
            ))}
          </DropDown>

          {/* The playground example includes this even when the blockType === 'code'. 
          However, I don't see any point in having alignment options for code blocks.
          Moreover, it looks correct within the editor, but will not currently look correct
          in the exported DOM HTML string. */}
          <Divider />

          <ElementFormatDropDown
            disabled={!isEditable}
            value={elementFormat}
            editor={activeEditor}
            isRTL={isRTL}
          />
        </>
      )}

      {modal}
    </div>
  )
}
