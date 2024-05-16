import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import Divider from '@mui/material/Divider'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Tooltip from '@mui/material/Tooltip'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { ContentCopy, ContentPaste } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import { Button } from '@mui/material'
import DragHandleIcon from '@mui/icons-material/DragHandle'

import { useState } from 'react'
import Box from '@mui/material/Box'
import ListCards from './ListCards/ListCards'


function Column() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
      minWidth: '300px',
      maxWidth: '300px',
      ml: 2,
      borderRadius: '6px',
      height: 'fit-content',
      maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
    }}>

      { /* Box column header*/}
      <Box sx={{
        height: (theme) => theme.trello.columnHeaderHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent:'space-between',
        p: 2,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0')
      }}
      >
        <Typography variant='h6' sx={{
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
        >
        Column title
        </Typography>
        <Box>
          <Tooltip title='More options'>
            <ArrowDropDownIcon
              sx={{ color: 'text.primary', cursor: 'pointer' }}
              id="basic-column-dropdown"
              aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            />
          </Tooltip>
          <Menu
            id="basic-menu-column-dropdown"
            sx={{ transform: 'translateY(4.5%)' }}
            aria-labelledby="basic-column-dropdown"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            <MenuItem>
              <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Add new card</ListItemText>
            </MenuItem> 
            <MenuItem>
              <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
              <ListItemText>Cut</ListItemText>
            </MenuItem> 
            <MenuItem>
              <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
              <ListItemText>Paste</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
              <ListItemText>Archive this column</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon><DeleteSweepIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Remove this column</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      { /* Box listcard*/}
      <ListCards/>

      { /* Box column footer*/}
      <Box sx={{
        height: (theme) => theme.trello.columnFooterHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent:'space-between',
        p: 2
      }}
      >
        <Button startIcon={<AddIcon/>}>Add new card</Button>
        <Tooltip title="Drag to move">
          <DragHandleIcon sx={{ cursor: 'pointer' }}/>
        </Tooltip>
      </Box>
    </Box>

  )
}

export default Column