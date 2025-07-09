import { ComponentProps, ReactNode } from 'react'
import { BreadcrumbProvider } from './BreadcrumbContext'
import { Breadcrumb } from './Breadcrumb'
import { BreadcrumbItem } from './BreadcrumbItem'

interface IBreadcrumbWithProvider extends ComponentProps<typeof Breadcrumb> {
  separator?: ReactNode
}

/* ========================================================================

======================================================================== */

const BreadcrumbWithProvider = ({
  children,
  separator = '/',
  ...otherProps
}: IBreadcrumbWithProvider) => {
  return (
    <BreadcrumbProvider separator={separator}>
      <Breadcrumb {...otherProps}>{children}</Breadcrumb>
    </BreadcrumbProvider>
  )
}

const CompoundComponent = Object.assign(BreadcrumbWithProvider, {
  Item: BreadcrumbItem
})

export { CompoundComponent as Breadcrumb, BreadcrumbItem }
