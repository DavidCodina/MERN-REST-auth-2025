import { ComponentProps } from 'react'

export interface ISimpleTable extends ComponentProps<'table'> {
  bordered?: boolean
  borderless?: boolean
  captionTop?: boolean
  /** Removes outer border from table. Can be used in conjunction with bordered/borderless. */
  flush?: boolean
  headerFooterAccent?: boolean
  hover?: boolean
  hoverData?: boolean
  useContainer?: boolean
  containerStyle?: React.CSSProperties
  containerClassName?: string
  /** Works only when responsive is true because it needs the container.
   * It transcends and includes the styles set by implementing flush.
   * However, it also adds a border to the responsive container.
   * Both the radius and the outer border can be modified through responsiveContainerStyle.
   * The rounded feature doesn't work well with <caption>.
   * */
  rounded?: boolean | number
  size?: 'xs' | 'sm' | ''
  striped?: boolean
  stripedData?: boolean
  stripedColumns?: boolean
}
