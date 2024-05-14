import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { SvgIcon, Typography } from '@mui/material'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'

function AppBar() {
  return (
    <div>
      <Box px={2} sx={{
        width: '100%',
        height: (theme) => theme.trello.navBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems:'center', gap: 2 }}>
          
          <AppsIcon sx={{ color:'primary.main' }} fontSize='small'/>

          <Box sx={{ display: 'flex', alignItems:'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color:'primary.main' }} fontSize='small'/>
            <Typography variant='span' sx={{ fontSize:'1.2rem', color:'primary.main', fontWeight:'bold' }}>Dloo</Typography>
          </Box>

          <Workspaces/>

          <Recent/>

          <Starred/>

          <Templates/>
          <Button variant="outlined">Create</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems:'center', gap: 2 }}>
          <TextField id="outlined-search" label="Search..." type="search" size='small'/>

          <ModeSelect/>

          <Tooltip title="Notification">
            <Badge color="secondary" variant="dot" sx={{ cursor:'pointer' }}>
              <NotificationsNoneIcon />
            </Badge>
          </Tooltip>

          <Tooltip title="Help" sx={{ cursor:'pointer' }}>
            <HelpOutlineIcon/>
          </Tooltip>

          <Profiles/>
        </Box>
      </Box>
    </div>
  )
}

export default AppBar