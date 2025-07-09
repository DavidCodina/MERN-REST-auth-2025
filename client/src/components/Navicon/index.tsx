import './index.css'

// interface INavicon1 extends ComponentProps<'button'>{
//   // ...
// }

/* ========================================================================
                                Navicon
======================================================================== */
// https://jonsuh.com/hamburgers/

export const Navicon = ({
  className = '',
  iconClassName = '',
  iconStyle = {},
  show,
  style = {},
  onClick,
  ...otherProps
}: any) => {
  /* ======================
      getButtonClassName()
  ====================== */

  const getButtonClassName = () => {
    let _className = 'hamburger-container hamburger-squeeze select-none'

    if (show) {
      _className = `${_className} active`
    }

    if (className) {
      _className = `${_className} ${className}`
    }

    return _className
  }

  /* ======================
          return
  ====================== */

  return (
    <button
      onClick={onClick}
      className={getButtonClassName()}
      // Why 9996? It needs to be below react-toastify (9999), below .offcanvas (9998),
      // and below the OffCanvasBackdrop (9997).
      style={{ zIndex: 9996, ...style }}
      {...otherProps}
    >
      <div
        className={`hamburger-inner${iconClassName ? ` ${iconClassName}` : ''}`}
        style={iconStyle}
      ></div>
    </button>
  )
}
