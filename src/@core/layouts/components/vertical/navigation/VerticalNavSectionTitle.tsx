// ** MUI Imports
import Divider from '@mui/material/Divider'
import MuiListSubheader, { ListSubheaderProps } from '@mui/material/ListSubheader'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Types
import { Settings } from 'src/@core/context/settingsContext'
import { NavSectionTitle } from 'src/@core/layouts/types'

// ** Custom Components Imports
import Box from '@mui/material/Box'
import Translations from 'src/layouts/components/Translations'
import UserIcon from 'src/layouts/components/UserIcon'
import CanViewNavSectionTitle from 'src/layouts/components/acl/CanViewNavSectionTitle'

interface Props {
  navHover: boolean
  settings: Settings
  item: NavSectionTitle
  collapsedNavWidth: number
  navigationBorderWidth: number
}

// ** Styled Components
const ListSubheader = styled((props: ListSubheaderProps) => <MuiListSubheader component='li' {...props} />)(
  ({ theme }) => ({
    lineHeight: 1,
    display: 'flex',
    position: 'static',
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(2),
    backgroundColor: 'transparent'
  })
)

const TypographyHeaderText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '0.75rem',
  lineHeight: 'normal',
  letterSpacing: '0.21px',
  textTransform: 'uppercase',
  fontWeight: theme.typography.fontWeightMedium
}))

const VerticalNavSectionTitle = (props: Props) => {
  // ** Props
  const { item, navHover, settings, collapsedNavWidth, navigationBorderWidth } = props

  // ** Vars
  const { navCollapsed } = settings

  return (
    <CanViewNavSectionTitle navTitle={item}>
      <ListSubheader
        className='nav-section-title'
        sx={{
          ...(navCollapsed && !navHover
            ? {
                py: 3.5,
                pr: (collapsedNavWidth - navigationBorderWidth - 24) / 8 - 1,
                pl: (collapsedNavWidth - navigationBorderWidth - 24) / 8 + 0.25
              }
            : { px: 0, py: 1.75 })
        }}
      >
        <Divider
          textAlign='left'
          sx={{
            m: '0 !important',
            lineHeight: 'normal',
            ...(navCollapsed && !navHover
              ? {
                  width: 22,
                  borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.3)`
                }
              : {
                  width: '100%',
                  textTransform: 'uppercase',
                  '&:before, &:after': { top: 7, transform: 'none' },
                  '& .MuiDivider-wrapper': { px: 2.5, fontSize: '0.75rem', letterSpacing: '0.21px' }
                })
          }}
        >
          {navCollapsed && !navHover ? null : (
            <TypographyHeaderText noWrap sx={{ color: 'text.disabled' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }} component={'span'}>
                <UserIcon fontSize={16} icon={item.icon as string} />
                <Box component={'span'} ml={1}>
                  <Translations text={item.sectionTitle} />
                </Box>
              </Box>
            </TypographyHeaderText>
          )}
        </Divider>
      </ListSubheader>
    </CanViewNavSectionTitle>
  )
}

export default VerticalNavSectionTitle
