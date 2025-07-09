import { ReactNode, ComponentProps, Suspense, isValidElement } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

///////////////////////////////////////////////////////////////////////////
//
// It might be easier to just extend ErrorBoundary...
// It also has a FallbackComponent, which probably clones the element
// and passes FallbackProps to it ???.
// https://github.com/bvaughn/react-error-boundary?tab=readme-ov-file#errorboundary-with-fallbackcomponent-prop
// However, it does get a little tricky because you have to pass only one prop.
//
///////////////////////////////////////////////////////////////////////////

interface IDataContainer {
  children: ReactNode
  errorMessage?: string
  showActualError?: boolean

  // Note You can also drill down into a Component's props by doing something like this:
  // type FallbackRenderProps = Pick<ComponentProps<typeof ErrorBoundary>, 'fallbackRender'>
  errorFallback?:
    | ErrorBoundary['props']['fallback']
    | ErrorBoundary['props']['fallbackRender']
    | ErrorBoundary['props']['FallbackComponent']

  onReset?: ErrorBoundary['props']['onReset']
  onError?: ErrorBoundary['props']['onError']
  suspenseFallback?: ComponentProps<typeof Suspense>['fallback']
}

function isRenderFunction(
  fallback:
    | ((props: FallbackProps) => React.ReactNode)
    | React.ComponentType<FallbackProps>
): fallback is (props: FallbackProps) => React.ReactNode {
  return typeof fallback === 'function'
}

/* ========================================================================

======================================================================== */

export const DataContainer = ({
  children,
  errorFallback,
  errorMessage = 'Request Failed!',
  showActualError = false,
  suspenseFallback,
  onError,
  onReset
}: IDataContainer) => {
  /* ======================
      fallbackRender()
  ====================== */

  const fallbackRender = (fallbackProps: FallbackProps) => {
    const { error, resetErrorBoundary } = fallbackProps
    const actualError = error instanceof Error ? error.message : ''
    const message = (showActualError && actualError) || errorMessage

    if (typeof errorFallback === 'function') {
      // https://react.dev/reference/react/isValidElement
      if (isValidElement(errorFallback)) {
        return errorFallback
      }

      // return (errorFallback as (props: FallbackProps) => ReactNode)(fallbackProps)
      if (isRenderFunction(errorFallback)) {
        return errorFallback(fallbackProps)
      }
    } else if (errorFallback) {
      return errorFallback
    }

    return (
      <div className='mx-auto mb-6 flex max-w-[800px] items-center justify-between rounded-lg border border-red-600 bg-red-50 p-4 text-sm font-bold text-red-500 shadow-md'>
        <span>{message}</span>
        <button
          className='btn-small btn-red min-w-[100px]'
          onClick={() => resetErrorBoundary()}
        >
          Reset
        </button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <ErrorBoundary
      onError={onError}
      onReset={onReset}
      fallbackRender={fallbackRender}
    >
      <Suspense
        fallback={
          suspenseFallback || (
            <h2 className='mt-6 text-center text-3xl font-black text-blue-500'>
              Loading...
            </h2>
          )
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
