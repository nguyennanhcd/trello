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
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { Zoom } from 'react-toastify'


import { useState } from 'react'
import Box from '@mui/material/Box'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column, createNewCard }) {

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })
  const dndKitColumnStyles = {
    // touchAction: 'none',
    // if use CSS.Transform there will be a stretched bugs
    transform: CSS.Translate.toString(transform),
    transition,
    /*
    The height must always be set to 100% to avoid an issue where, when dragging a shorter column past a taller one, you have to drag in a very specific area, which is frustrating (as demonstrated in video 32). Note that at this point, you need to combine it with { ...listeners } located in the Box, not in the outermost div, to avoid dragging into the blue area.
    */
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const orderedCards = column.cards


  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [cardInputValue, setCardInputValue] = useState('')
  const handleChangeCardInputValue = (e) => {
    setCardInputValue(e.target.value)
  }

  const handleAddNewCard = async () => {
    if (!cardInputValue) {
      toast.error('Please fill in this box', {
        transition: Zoom
      })
      return
    }

    // call API 
    const newCardData = {
      title: cardInputValue,
      columnId: column._id
    }

    await createNewCard(newCardData)

    toggleOpenNewCardForm()
    setCardInputValue('')
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes} >
      <Box
        {...listeners}
        sx={{
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
          justifyContent: 'space-between',
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
            {column?.title}
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
        <ListCards cards={orderedCards} />

        { /* Box column footer*/}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}
        >
          {!openNewCardForm
            ?
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
              <Button
                startIcon={<AddIcon />}
                onClick={toggleOpenNewCardForm}
              >
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
            :
            <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                value={cardInputValue}
                onChange={(e) => handleChangeCardInputValue(e)}
                label="Enter card title"
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd='true'
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#333643' : 'white'
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant='contained'
                  color='success'
                  size='small'
                  onClick={() => handleAddNewCard()}
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main, borderWidth: 1 }
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  onClick={toggleOpenNewCardForm}
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                />
              </Box>
            </Box>
          }

        </Box>
      </Box>

    </div>

  )


}
export default Column