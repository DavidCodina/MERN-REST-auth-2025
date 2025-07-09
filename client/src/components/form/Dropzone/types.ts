import { ComponentPropsWithRef, MutableRefObject } from 'react'
import { DropzoneOptions } from 'react-dropzone'

export type DropZoneRef = HTMLDivElement

export type PreviewObject = { name: string; readerResult: string }

export type OnDrop = NonNullable<DropzoneOptions['onDrop']>
// type OnDrop2 = Exclude<DropzoneOptions['onDrop'], undefined>
// type OnDrop3 = Exclude<Pick<DropzoneOptions, 'onDrop'>, undefined>

export interface DropZoneProps
  extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
  apiRef?: MutableRefObject<unknown>
  acceptMessage?: string
  disabled?: boolean
  dropzoneOptions?: DropzoneOptions
  error?: string
  formGroupClassName?: string
  formGroupStyle?: React.CSSProperties
  inputId?: string
  inputName?: string
  label?: string // Could be React.ReactNode, but string is okay for now.
  labelClassName?: string
  labelRequired?: boolean
  labelStyle?: React.CSSProperties
  onChange?: (newValue: File[] | null) => void
  showPreviews?: boolean
  touched?: boolean
  value?: File[] | null
}

export interface PreviewProps {
  deleteFileByName: (fileName: string) => void
  disabled: boolean
  previews: PreviewObject[] | null
}
