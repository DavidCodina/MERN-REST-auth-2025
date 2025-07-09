'use client'

import { PreviewProps } from './types'

/* ========================================================================

======================================================================== */

export const Previews = ({
  disabled = false,
  previews,
  deleteFileByName
}: PreviewProps) => {
  /* ======================
          return
  ====================== */

  return (
    <>
      {Array.isArray(previews) && previews.length > 0 && (
        <div className='dropzone-previews-container'>
          {previews.map((preview: any, _index) => {
            return (
              <div className='dropzone-preview' key={preview.name}>
                {preview.readerResult.substring(5, 10) === 'image' ? (
                  <img
                    className='dropzone-preview-with-img'
                    src={preview.readerResult}
                    alt={preview.name}
                  />
                ) : (
                  <div className='dropzone-preview-without-img'>
                    {preview.name}
                  </div>
                )}

                <button
                  className='dropzone-preview-delete-btn'
                  disabled={disabled}
                  onClick={(e) => {
                    if (disabled) {
                      return
                    }
                    e.stopPropagation()
                    deleteFileByName(preview.name)
                  }}
                  title='Remove Image'
                  type='button'
                >
                  <svg
                    width='1em'
                    height='1em'
                    fill='currentColor'
                    viewBox='0 0 16 16'
                  >
                    <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708' />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
