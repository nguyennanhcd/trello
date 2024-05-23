import { useState } from 'react'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import { Button } from '@mui/material'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'


function ListColumns({ columns }) {
  /*
    SortableContext requires items as an array type value, ['id-1', 'id-2] not [{id: 'id-1}, {id: 'id-2}']
    If the the items param is passed in with an incorrect form, dragging and dropping still work but without animation
    https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
  */

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [columnInputValue, setColumnInputValue] = useState('')
  const handleChangeColumnInputValue = (e) => {
    setColumnInputValue(e.target.value)
  }

  const handleAddNewColumn = () => {
    if (!columnInputValue) {
      return
    }

    toggleOpenNewColumnForm()
    setColumnInputValue('')
  }

  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
      >
        {columns?.map(column => (
          <Column key={column._id} column={column} />
        ))}

        {!openNewColumnForm
          ?
          <Box sx={{
            minWidth: '170px',
            maxWidth: '170px',
            mx: 2,
            borderRadius: '5px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}
            onClick={toggleOpenNewColumnForm}
          >
            <Button
              startIcon={<PlaylistAddIcon />}
              sx={{
                color: 'white',
                width: '100%'
              }}
            >
              Add new column
            </Button>
          </Box>
          :
          <Box sx={{
            minWidth: ' 250px',
            maxWidth: ' 250px',
            mx: 2,
            p: 1,
            borderRadius: '5px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              value={columnInputValue}
              onChange={(e) => handleChangeColumnInputValue(e)}
              label="Enter column title"
              type="text"
              size='small'
              variant='outlined'
              autoFocus
              // value={searchValue}
              // onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant='contained'
                color='success'
                size='small'
                onClick={() => handleAddNewColumn()}
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main, borderWidth: 1 }
                }}
              >
                Add Column
              </Button>
              <CloseIcon
                fontSize='small'
                onClick={toggleOpenNewColumnForm}
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: '#DCEFFF' }
                }}
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns