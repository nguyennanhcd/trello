import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PublicIcon from '@mui/icons-material/Public'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'


const MENU_STYLES = {
  bgcolor:'transparent',
  color: 'white',
  border:'none',
  paddingX: '5px',
  '&:hover': {
    bgcolor: 'primary.50'
  },
  '& .MuiSvgIcon-root': {
    color: 'white'
  }
}
function BoardBar() {
  return (
    <div>
      <Box px={2} sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflow:'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
      }}>
        <Box sx={{ display: 'flex', alignItems:'center', gap: 2 }}>
          <Chip 
            sx={MENU_STYLES}
            icon={<DashboardIcon />} 
            label="Dloo"
            clickable
          />

          <Chip 
            sx={MENU_STYLES}
            icon={<PublicIcon />} 
            label="Public/Private Workspaces"
            clickable
          />

          <Chip 
            sx={MENU_STYLES}
            icon={<AddToDriveIcon />} 
            label="Add to Google Drive"
            clickable
          />

          <Chip 
            sx={MENU_STYLES}
            icon={<AutoAwesomeIcon />} 
            label="Automation"
            clickable
          />

          <Chip 
            sx={MENU_STYLES}
            icon={<FilterListIcon />} 
            label="Filters"
            clickable
          />

        </Box>
        <Box sx={{ display: 'flex', alignItems:'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<PersonAddIcon/>}
            sx={{ 
              color: 'white',
              borderColor: 'white',
              '&:hover ': { borderColor: 'white' }
            }}
          >
            Invite
          </Button>
          <AvatarGroup 
            max={4}
            sx={{
              gap: '10px',
              '& .MuiAvatar-root': {
                width: 30,
                height: 30,
                fontSize: 18,
                border: 'none',
                '&:first-of-type': {
                  bgcolor: '#a4b0be'
                }
              }
            }}
          >
            <Tooltip title="me">
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </Tooltip>
          </AvatarGroup>
        </Box>
      </Box>
    </div>
  )
}

export default BoardBar