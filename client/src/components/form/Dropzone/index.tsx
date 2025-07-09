'use client'

import React, {
  Fragment,
  useCallback,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useId
} from 'react'
import {
  // The useDropzone hook from the react-dropzone library is considered headless.
  // This means that it provides the core functionality and logic for handling file drops,
  // but it doesn’t include any UI components. Instead, it gives you the flexibility to
  // build your own custom UI around the dropzone functionality.
  useDropzone
  // DropzoneOptions
  // FileRejection,
  // DropEvent
} from 'react-dropzone'

import { Previews } from './Previews'
import { deepEqual, setFilePreviews } from './utils'
import { isFileArray } from 'utils'
import { DropZoneProps, PreviewObject, OnDrop, DropZoneRef } from './types'

export type DropzoneAPI = {
  clear: () => void
}

/* ========================================================================
                                DropZone
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// All of the styles for this component are located within formPlugin.ts
//
// Docs:          https://react-dropzone.js.org/#!/Dropzone
// Hamed Bahram:  https://www.youtube.com/watch?v=eGVC8UUqCBE
// James Q Quick: https://www.youtube.com/watch?v=SBL3dhKs21o
//
///////////////////////////////////////////////////////////////////////////

export const DropZone = forwardRef<DropZoneRef, DropZoneProps>(
  (
    {
      acceptMessage = 'PNG and JPG files are allowed',
      apiRef,
      className = '',
      disabled,
      dropzoneOptions = {},
      error,
      formGroupClassName = '',
      formGroupStyle = {},
      id,
      inputId,
      inputName,
      label = '',
      labelClassName = '',
      labelRequired = false,
      labelStyle = {},
      style = {},
      onBlur,
      onChange,
      showPreviews = true,
      touched,
      value = null,
      ...otherProps
    },
    ref
  ) => {
    /* ======================
          constants 
    ====================== */

    const dropzoneId = useId()
    id = id || dropzoneId

    const fileInputId = useId()
    inputId = inputId || fileInputId

    // disabled can be set directly as a prop (which has priority), or it can be set through dropzoneOptions
    disabled =
      typeof disabled === 'boolean'
        ? disabled
        : typeof dropzoneOptions.disabled === 'boolean'
          ? dropzoneOptions.disabled
          : false

    /* ======================
          state & refs 
    ====================== */

    // This is used to prevent onChange from firing on mount or immediately
    // after mount within the associated useEffect() below.
    const hasChangedRef = useRef(false)

    const [files, setFiles] = useState<File[] | null>(value || null)
    const [previews, setPreviews] = useState<PreviewObject[] | null>(null)

    // Derived state
    const fileNames: string[] | null = (() => {
      if (Array.isArray(files) && files.length > 0) {
        const names = files.map((file) => {
          const { name } = file
          return name
        })
        return names
      }
      return null
    })()

    /* ======================
              api
    ====================== */

    if (typeof apiRef !== 'undefined') {
      apiRef.current = {
        clear: () => {
          setFiles(null)
        }
      }
    }

    /* ======================
           onDrop() 
    ====================== */
    // onDrop?: <T extends File>( acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
    // The basic idea here is that we update files state with acceptedFiles.

    const onDrop = useCallback<OnDrop>(
      (
        acceptedFiles, //   File[],
        _fileRejections, // FileRejection[],
        _event //           DropEvent
      ) => {
        ///////////////////////////////////////////////////////////////////////////
        //
        // A file will be rejected if it does not match the options specified in
        // options.accept options.maxSize, etc. One could have onFileRejection()
        // prop that gets triggered here whenever there are file rejections.
        // However, there's already options.onDropRejected().
        //
        // Note: Suppose you drop a single file and it gets rejected. In that case,
        // acceptedFiles will be: []. This is what through James Q Quick off in this
        // tutorial: https://www.youtube.com/watch?v=SBL3dhKs21o
        //
        // To mitigate this gotcha here, we make sure to check if it's an array AND
        // that it has length greater than 0, and of course it doesn't hurt to double-check
        // that all elements within the array are actually of type File.
        //
        // If we drop a single file, and it gets rejected,
        //
        ///////////////////////////////////////////////////////////////////////////

        if (
          Array.isArray(acceptedFiles) &&
          acceptedFiles.length > 0 &&
          isFileArray(acceptedFiles)
        ) {
          // hasChangedRef.current is checked in the useEffect() below that calls
          // onChange?.(files) whenever files changes.
          if (hasChangedRef.current === false) {
            hasChangedRef.current = true
          }
          setFiles(acceptedFiles)
        }
      },
      []
    )

    /* ======================
          getClassName() 
    ====================== */
    // Applied to the dropzone <div>.

    const getClassName = () => {
      let classes = `dropzone`

      if (disabled) {
        classes = `${classes} disabled`
      }

      if (isDragActive) {
        classes = `${classes} drag-active`
      }

      if (error) {
        // See '.dropzone.is-invalid' & '.dropzone.is-invalid:focus' in formPlugin.ts.
        classes = `${classes} is-invalid`
      } else if (!error && touched) {
        classes = `${classes} is-valid`
      }

      if (className) {
        classes = `${classes} ${className}`
      }

      return classes
    }

    /* ======================
          useDropzone() 
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // There's a lot more we can destructure, but currently don't need.
    //
    //   type DropzoneState = DropzoneRef & {
    //     isFocused: boolean;
    //     isDragActive: boolean;
    //     isDragAccept: boolean;
    //     isDragReject: boolean;
    //     isFileDialogActive: boolean;
    //     acceptedFiles: File[];
    //     fileRejections: FileRejection[];
    //     rootRef: React.RefObject<HTMLElement>;
    //     inputRef: React.RefObject<HTMLInputElement>;
    //     getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
    //     getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
    //   };
    //
    // There's also a lot more we can add to options:
    //
    //   type DropzoneOptions = Pick<React.HTMLProps<HTMLElement>, PropTypes> & {
    //     accept?: Accept;
    //     minSize?: number;
    //     maxSize?: number;
    //     maxFiles?: number;
    //     preventDropOnDocument?: boolean;
    //     noClick?: boolean;
    //     noKeyboard?: boolean;
    //     noDrag?: boolean;
    //     noDragEventsBubbling?: boolean;
    //     disabled?: boolean;
    //     onDrop?: <T extends File>(
    //       acceptedFiles: T[],
    //       fileRejections: FileRejection[],
    //       event: DropEvent
    //     ) => void;
    //     onDropAccepted?: <T extends File>(files: T[], event: DropEvent) => void;
    //     onDropRejected?: (fileRejections: FileRejection[], event: DropEvent) => void;
    //     getFilesFromEvent?: (
    //       event: DropEvent
    //     ) => Promise<Array<File | DataTransferItem>>;
    //     onFileDialogCancel?: () => void;
    //     onFileDialogOpen?: () => void;
    //     onError?: (err: Error) => void;
    //     validator?: <T extends File>(file: T) => FileError | FileError[] | null;
    //     useFsAccessApi?: boolean;
    //     autoFocus?: boolean;
    //   };
    //
    ///////////////////////////////////////////////////////////////////////////

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      // Pass: dropzoneOptions={{ accept: {} }} from the outside to accept all.
      accept: {
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png']
        // 'image/gif': ['.gif'],
      },
      disabled: disabled,
      ...dropzoneOptions, // maxSize, multiple:false, etc.
      onDrop
    })

    /* ======================
            rootProps 
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // rootProps are applied to the dropzone <div>.
    //
    // According to Hamed Bahram video https://www.youtube.com/watch?v=eGVC8UUqCBE
    // at 5:30, all props/attrs should be passed through getRootProps(), rather than applied directly.
    // The docs also recommend this approach. This is to ensure that we don't inadvertently overwrite
    // props set by rootProps. That said, in some cases (e.g., className) it's okay to set props
    // directly.
    //
    ///////////////////////////////////////////////////////////////////////////

    const { ref: rootPropsRef, ...otherRootProps }: any = getRootProps({
      className: getClassName(),
      id: id,
      onBlur: (e: React.FocusEvent<HTMLDivElement, Element>) => {
        onBlur?.(e as any)
      },
      onFocus: (_e: React.FocusEvent<HTMLDivElement, Element>) => {},
      style: style,
      ...otherProps
    })

    /* ======================
        deleteFileByName()
    ====================== */
    // Used in renderParagraph2() and <Previews previews={previews} deleteFileByName={deleteFileByName} />
    // Given some fileName arg it filters out the file by that name and assigns newFiles to files state.

    const deleteFileByName = (fileName: string) => {
      setFiles((prevFiles) => {
        if (
          Array.isArray(prevFiles) &&
          prevFiles.length > 0 &&
          isFileArray(prevFiles)
        ) {
          const newFiles = prevFiles?.filter((file) => file.name !== fileName)

          if (newFiles) {
            return newFiles
          }
        }

        return prevFiles
      })
    }

    /* ======================
          renderLabel()
    ====================== */

    const renderLabel = () => {
      if (label) {
        return (
          <label
            htmlFor={id}
            className={`form-label${
              labelClassName ? ` ${labelClassName}` : ''
            }`}
            style={{
              ...labelStyle,
              ...(disabled ? { color: 'var(--form-disabled-color)' } : {})
            }}
          >
            {label}{' '}
            {labelRequired && (
              <sup
                className=''
                style={{
                  color: disabled ? 'inherit' : 'red' // ???
                }}
              >
                *
              </sup>
            )}
          </label>
        )
      }
      return null
    }

    /* ======================
          renderError() 
    ====================== */

    const renderError = () => {
      if (error) {
        return <div className='invalid-feedback block'>{error}</div>
      }
      return null
    }

    /* ======================
          useEffect() //* ✅ Looks good!
    ====================== */

    useEffect(() => {
      if (!showPreviews) {
        setFilePreviews([], setPreviews)
        return
      }

      ///////////////////////////////////////////////////////////////////////////
      ///
      // If showPreviews is true then pass files and the setPreviews setter.
      // setFilePreviews() is a utility that generates PreviewObject[] | null:
      //
      //   [{ name: "peter.png", readerResult: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPc..." }]
      //
      // Then assigns the result to previews state. The previews state is then used as follows:
      //
      //    <Previews previews={previews} deleteFileByName={deleteFileByName} />
      //
      //# Rather than having a setFilePreviews() function, wouldn't it be more idiomatic to
      //# have a usePreviews hook that did all this for us.
      //
      ///////////////////////////////////////////////////////////////////////////

      setFilePreviews(files, setPreviews)
    }, [files, showPreviews])

    /* ======================
          useEffect()
    ====================== */
    // Two-way binding part 1: Any time files changes internally, call the external onChange().
    // Initially, I was using onChangeRef.current?.(files) to bypass the dependency array.
    // However, onChange is often used to check a dynamic value of touchedFields.files, so
    // we definitely don't want to use that approach.

    useEffect(() => {
      if (hasChangedRef.current === false) {
        return
      }
      // Don't do this: onChangeRef.current?.(files)
      onChange?.(files)
    }, [files]) // eslint-disable-line react-hooks/exhaustive-deps

    /* ======================
          useEffect()  
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // Two-way binding part 2:
    //
    // Any time value changes externally, call internal setFiles().
    // The gotcha here is that value will often be an array, and each
    // array is a new reference type, which will end up causing an
    // infinite loop. On way of fixing this would be to run a  deepEqual()
    // check for value vs files and return early if they're lready the same
    //
    // The other option is to create a valueOrFiles constant that represents the single source of
    // truth for files. The valueOrFiles solution is appealing, but it could create unexpected
    // results because internally files is never truly reset.
    //
    // Note: Suppose you are using react-hook-form. In order to prevent triggering the onChange after
    // reset(undefined, {}), you need to have an onChange handler that only validates after having been
    // touched:
    //
    //   onChange={(newValue: any) => {
    //     setValue('files', newValue, {
    //       shouldValidate: touchedFields.files ? true : false,
    //       shouldDirty: true,
    //       shouldTouch: true
    //     })
    //   }}
    //
    ///////////////////////////////////////////////////////////////////////////

    useEffect(() => {
      setFiles((prevFiles) => {
        const isEqual = deepEqual(value, prevFiles)

        if (isEqual) {
          // console.log('returning prevFiles...')
          return prevFiles
        }

        // console.log('returning new value...')
        return value
      })
    }, [value])

    /* ======================
      renderParagraph1() 
    ====================== */
    // Paragraph 1 is the main paragraph underneath the upload <svg>.
    // It will render in one of three ways depending on whether or not
    // there are files and/or isDragActive.

    const renderParagraph1 = () => {
      if (isDragActive) {
        return <p className='dropzone-p1'>Drop it like it's hot!</p>
      }

      if (files && Array.isArray(files) && files.length > 0) {
        return <p className='dropzone-p1'>Selected files:</p>
      } else {
        return (
          <p className='dropzone-p1'>
            Drop your files here, or{' '}
            <span className='dropzone-p1-span'>browse</span>
          </p>
        )
      }
    }

    /* ======================
        renderParagraph2() 
    ====================== */
    // Paragraph 2 will initially render with the acceptMessage prop.
    // However, if there are files then for each file a button will
    // be created that is used for deleting the file.

    const renderParagraph2 = () => {
      if (files && Array.isArray(fileNames) && fileNames.length > 0) {
        return (
          <p className='dropzone-p2'>
            {fileNames.map((name, index) => (
              <Fragment key={index}>
                <button
                  className='dropzone-p2-btn'
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFileByName(name)
                  }}
                  type='button'
                  title='Delete Image'
                >
                  {name}
                </button>
                {index !== fileNames.length - 1 ? ', ' : ''}
              </Fragment>
            ))}
          </p>
        )
      }

      return <p className='dropzone-p2'>{acceptMessage}</p>
    }

    /* ======================
      renderDeleteButton() 
    ====================== */
    // This is the trash icon in the upper right cornder.
    // It allows the user to delete the selected files.

    const renderDeleteButton = () => {
      if (files && Array.isArray(files) && files.length > 0)
        return (
          <button
            className='dropzone-btn-delete'
            disabled={disabled}
            onClick={(e) => {
              if (disabled) {
                return
              }
              e.stopPropagation()
              setFiles(null)
              setPreviews(null)
            }}
            title='Clear Files'
            type='button'
          >
            <svg width='24' height='24' fill='currentColor' viewBox='0 0 16 16'>
              <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' />
              <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' />
            </svg>
          </button>
        )

      return null
    }

    /* ======================
        renderDropzone() 
    ====================== */

    const renderDropzone = () => {
      return (
        <div
          aria-labelledby={id}
          aria-label='File upload area'
          role='region'
          ref={(node) => {
            // We can't know in advance whether ref will be a function or an object literal.
            // For that reason, we need to use the following conditional logic.
            // https://stackoverflow.com/questions/71495923/how-to-use-the-ref-with-the-react-hook-form-react-library
            if (ref && 'current' in ref) {
              ref.current = node
            } else if (typeof ref === 'function') {
              ref?.(node)
            }

            if (rootPropsRef && 'current' in rootPropsRef) {
              rootPropsRef.current = node
            }
          }}
          {...otherRootProps}
        >
          <input
            // When files are dropped onto the dropzone, it doesn’t trigger the onChange event of this internal input element.
            // Instead, it triggers the onDrop event of the dropzone itself. Despite numerous examples showing an onChange prop
            // beign used here, that is not actually the correct approach.
            {...getInputProps({
              id: inputId,
              name: inputName
            })}
          />

          <svg
            className='dropzone-svg'
            fill='currentColor'
            height='80px'
            stroke='currentColor'
            strokeWidth='0' // Or is it ={0}
            viewBox='0 0 24 24'
            width='80px'
          >
            <path fill='none' d='M0 0h24v24H0V0z'></path>
            <path d='M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95A5.469 5.469 0 0112 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11A2.98 2.98 0 0122 15c0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z'></path>
          </svg>

          {renderParagraph1()}
          {renderParagraph2()}

          <Previews
            disabled={disabled}
            previews={previews}
            deleteFileByName={deleteFileByName}
          />

          {renderDeleteButton()}
        </div>
      )
    }

    /* ======================
        renderDataTest() 
    ====================== */
    // The File object in JavaScript contains a lot of prototype methods and properties
    // that are not enumerable. When you use JSON.stringify(), it only serializes the enumerable
    // own properties of the object, and path is one of them. If you want to display other properties
    // like name, size, type, etc., you can create a new object that only contains the properties
    // you’re interested in, and then stringify that object

    const _renderDataTest = () => {
      if (Array.isArray(files) && files.length > 0) {
        return (
          <pre className='mx-auto mt-12 w-full max-w-[800px] rounded-xl border border-violet-800 bg-white p-6 text-sm shadow'>
            <code>
              {files
                .map((file) => {
                  const { name, size, type } = file
                  return JSON.stringify({ name, size, type }, null, 2)
                })
                .join(', \n\n')}
            </code>
          </pre>
        )
      }

      return null
    }

    /* ======================
            return
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // The styles here are a modified version of what's done in
    // https://horizon-ui.com/docs-tailwind/docs/react/dropzone
    // but without dark mode and responsive classes.
    // Horizon UI does not have open source code for this component.
    //
    // horizon-ui makes the top-level JSX element a button, but because in this implementation
    // there are nested buttons, I've made it a <div> because I was getting console warnings that
    // <button> cannot appear as a descendant of <button>. In any case React Dropzone already
    // bakes in the tabbing and 'Enter' behavior.
    //
    ///////////////////////////////////////////////////////////////////////////

    return (
      <section className={formGroupClassName} style={formGroupStyle}>
        {renderLabel()}
        {renderDropzone()}
        {renderError()}
        {/* {_renderDataTest()} */}
      </section>
    )
  }
)

DropZone.displayName = 'DropZone'
