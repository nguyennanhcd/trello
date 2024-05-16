import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
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
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <div>
      <Box px={2} sx={{
        width: '100%',
        height: (theme) => theme.trello.navBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflow:'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
      }}>
        <Box sx={{ display: 'flex', alignItems:'center', gap: 2 }}>
          
          <AppsIcon sx={{ color:'white' }} fontSize='small'/>

          <Box sx={{ display: 'flex', alignItems:'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color:'white' }} fontSize='small'/>
            <Typography variant='span' sx={{ fontSize:'1.2rem', color:'white', fontWeight:'bold' }}>Dloo</Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex', gap: 1 } }}>
            <Workspaces/>
            <Recent/>
            <Starred/>
            <Templates/>
            <Button 
              sx={{ 
                color: 'white',
                border: 'none',
                '&:hover': {
                  border: 'none'
                }
              }} 
              variant="outlined" 
              startIcon={<LibraryAddIcon/>}
            >
              Create
            </Button>
          </Box>

        </Box>
        <Box sx={{ display: 'flex', alignItems:'center', gap: 2 }}>
          <TextField 
            id="outlined-search" 
            label="Search..." 
            type="text" 
            size='small' 
            value={searchValue}
            onChange = {(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color:'white', fontSize: 'large' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <CloseIcon 
                  fontSize='small'
                  onClick={ () => setSearchValue('') }
                  sx={{
                    display: searchValue ? 'inline-block' : 'none',
                    color:'white',
                    cursor:'pointer',
                    '&:hover': {
                      color:'white'
                    }
                  }}  
                />
              )
            }}
            sx={{ 
              minWidth: '120px',
              maxWidth: '170px',
              '& label': { color:'white' },
              '& input': { color:'white' },
              '& label.Mui-focused': { color:'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
              }
            }}
          />

          <ModeSelect />

          <Tooltip title="Notifications">
            <Badge color="warning" variant="dot" sx={{ cursor:'pointer' }}>
              <NotificationsNoneIcon sx={{ color:'white' }} />
            </Badge>
          </Tooltip>

          <Tooltip title="Help">
            <HelpOutlineIcon sx={{ color:'white', cursor:'pointer' }}/>
          </Tooltip>

          <Profiles/>
        </Box>

      </Box>
    </div>
  )
}

export default AppBar