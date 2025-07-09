export interface IModalSessionTimeout {
  handleContinueSession: () => void
  onClose: () => void
  remaining: number
  show: boolean
}
