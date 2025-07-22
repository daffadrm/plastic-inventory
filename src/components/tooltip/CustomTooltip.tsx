import { styled } from '@mui/material/styles'
import Tooltip, { type TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#F9F3F0',
    color: '#1e6baf',
    boxShadow: theme.shadows[1],
    fontSize: 'clamp(0.56rem, 1.1vw, 0.68rem)',
    maxWidth: 500,
    fontWeight: 500
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#F9F3F0'
  }
}))
