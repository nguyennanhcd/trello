import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import mapOrder from '~/utils/sorts'
import { 
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  //Require the mouse to move by 10 pixels before activating, fix the case calling event when click
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 100 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => { 
    // eslint-disable-next-line no-console
    console.log(event)

    //Check if over is exist or not ( kéo linh tinh ra ngoài thì return tránh lỗi )
    const { active, over } = event
    
    if (!over) return
    if (active.id !== over.id) 
    {      
      // const activeIndex = board?.columnOrderIds?.indexOf(active.id)
      // const overIndex = board?.columnOrderIds?.indexOf(over.id)

      // for ( let i = 0; i < board.columnOrderIds.length; i++ )
      // {
      //   let tmp = board.columnOrderIds[activeIndex]
      //   board.columnOrderIds[activeIndex] = board.columnOrderIds[overIndex]
      //   board.columnOrderIds[overIndex] = tmp
      // }
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      // arrayMove is used to rearrange the original Columns
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns: ', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={(event) => handleDragEnd(event)} sensors={sensors}>
      <div>
        <Box sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}>
          <ListColumns columns={ orderedColumns }/>
        </Box>
      </div>
    </DndContext>
  )
}

export default BoardContent