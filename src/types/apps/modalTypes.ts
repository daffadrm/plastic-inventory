export type ModalAddDataExcelProps = {
  isOpen: boolean
  toggle: (dataParam: any) => void
  fetchData: () => void
}

export type ModalAddColumnProps = {
  isOpen: boolean
  toggle: (dataParam: any) => void
  onSubmit: (data: any) => void
}

export type ModalConfirmationProps = {
  isOpen: boolean
  toggle: (dataParam: any) => void
  handleRequest: (dataParam?: any) => void
  title?: string
  warning?: any
  icon?: string
  actionText?: string
  data?: any
  isLoading?: boolean
  handleClose?: () => void
}

export type ModalConfirmationRowProps = {
  isOpen: boolean
  toggle: (dataParam: any) => void
}
