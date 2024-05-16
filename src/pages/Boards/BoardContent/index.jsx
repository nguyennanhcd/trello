import Box from '@mui/material/Box'
import { useState } from 'react'
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
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import PersonIcon from '@mui/icons-material/Person'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'
function BoardContent() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <Box sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}>
          { /* Box column*/}
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
              height: COLUMN_HEADER_HEIGHT,
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
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap:1,
              
              // trick css for beautiful scrollbar
              p: '0 5px',
              m: '0 5px',


              overflowX: 'hidden',
              overflowY: 'auto !important',
              maxHeight:  (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${COLUMN_HEADER_HEIGHT} - ${COLUMN_FOOTER_HEIGHT} )`,
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ced0da',
                border: '8px',
                borderRadius: '8px'
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#bfc2cf'
              }
            }}
            >
              <Card sx={{ 
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow:'unset'
              }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image="https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-1/438260241_1689681748509886_3914010373219127903_n.jpg?stp=dst-jpg_p200x200&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGi0Igi3iLbi1zdyPzLmQNXg-AmEcbVR_KD4CYRxtVH8oyAayImkvFTL3k9sEDBnfX_vipyn2KRLgQFf5Nh_kUC&_nc_ohc=pIGmCZ5rGLEQ7kNvgE0_8RW&_nc_ht=scontent.fsgn2-11.fna&oh=00_AYDDWXiQ2P7NNHpgHBb9fMG1cicJbp_ldaRE-QK0t1d1_Q&oe=664B9C88"
                  title="green iguana"
                />
                <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                  <Typography>Ngọc Dung</Typography>
                </CardContent>
                <CardActions sx={{ p: '0 4px 8px 4px' }}>
                  <Button size="small" startIcon={<PersonIcon/>}>20</Button>
                  <Button size="small" startIcon={<CommentIcon/>}>10</Button>
                  <Button size="small" startIcon={<AttachmentIcon/>}>15</Button>
                </CardActions>
              </Card>

              <Card sx={{ 
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow:'unset'
              }}>
                <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}> 
                  <Typography>
                    Lizard
                  </Typography>
                </CardContent>
              </Card>
        
            </Box>

            { /* Box column footer*/}
            <Box sx={{
              height: COLUMN_FOOTER_HEIGHT,
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


        </Box>
      </Box>

    </div>
  )
}

export default BoardContent