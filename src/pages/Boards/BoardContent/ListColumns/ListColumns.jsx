import Box from '@mui/material/Box'
import Column from './Column/Column'
import { Button } from '@mui/material'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'

function ListColumns() {
    
  return (
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
      <Column/>
      <Column/>

      {/*box add new column */}
      <Box sx={{
        minWidth: '170px',
        maxWidth: '170px',
        mx: 2,
        borderRadius: '5px',
        height: 'fit-content',
        bgcolor: '#ffffff3d'
      }}
      >
        <Button
          startIcon={<PlaylistAddIcon/>}
          sx={{
            color: 'white',
            width: '100%'
          }}
        >
          Add new column
        </Button>
      </Box>

    </Box>
  )
}

export default ListColumns