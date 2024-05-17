import Box from '@mui/material/Box'
import Column from './Column/Column'
import { Button } from '@mui/material'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

function ListColumns({ columns }) {
  /*
    SortableContext requires items as an array type value, ['id-1', 'id-2] not [{id: 'id-1}, {id: 'id-2}']
    If the the items param is passed in with an incorrect form, dragging and dropping still work but without animation
    https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
  */

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
          <Column key={column._id} column={column}/>
        ))}

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
    </SortableContext>
  )
}

export default ListColumns