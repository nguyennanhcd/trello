import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import mapOrder from '~/utils/sorts'
import { 
  DndContext,
  MouseSensor,
  TouchSensor,
  // PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCenter
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board }) {
  //Require the mouse to move by 10 pixels before activating, fix the case calling event when click
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 100 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // make suer that at one time, there's only one element can be dragged ( column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // In this segment, it's important to use c.cards instead of c.cardOrderIds because, in the handleDragOver step, we will complete the data for cards first before creating cardOrderIds.
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    // console.log('dragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //
    if ( event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  //trigger while dragging an element
  const handleDragOver = (event) => {
    // console.log('dragOver: ', event)

    //do nothing when drag a column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    
    // If you drag a card, you need to handle some action to drag cards between columns
    const { active, over } = event

    if ( !active || !over ) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    // find 2 columns by cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // handle logic here just in case drag card to a different column, if drag card to the original column position, do nothing
    // Because this is the processing part during the drag, handling after the drag is completed is a different issue in the handleDragEnd section.
    if ( activeColumn._id !== overColumn._id ) 
    {
      setOrderedColumns(prevColumns => {
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        // new logic 'newCardIndex' ( up or down of overCard ) take from the code of dndkitlib
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        const nextColumn = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumn.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumn.find(column => column._id === overColumn._id)

        if (nextActiveColumn) {

          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // reupdate cardOrderIds 
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if (nextOverColumn) {
          // check that if the current dragging card exists in the overColumn or not, if it exists, remove it first
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // Adding current dragging card to overColumn by new index
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          // reupdate cardOrderIds 
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }
        return nextColumn
      })
    }
  }

  const handleDragEnd = (event) => { 

    const { active, over } = event
    //Check if over or active is exist or not ( kéo linh tinh ra ngoài thì return tránh lỗi )
    if (!over || !active) return

    // handle drag and drop for cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) 
    {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      // find 2 columns by cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      // hành động kéo thả card giữa 2 columns khác nhau
      // phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id( set vào state từ bước handleDragStart ) chứ không phải active trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật lại 1 lần rôi 
      // console.log('oldColumnWhenDraggingCard: ', oldColumnWhenDraggingCard)
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // console.log('drag and drop operation between 2 columns')
      } else {
        // handle drag and drop operation within a column
        // take the card original position from oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // take the card new position from overCard
        const newCardIndex = overColumn?.cards.findIndex(c => c._id === overCardId)

        // arrayMove is used to rearrange the original Cards, use the same logic with drag and drop operattion in column
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        
        setOrderedColumns(prevColumns => {
          // clone prevColumns and then handle data change
          const nextColumn = cloneDeep(prevColumns)

          // find the Column that we drag and drop
          const targetColumn = nextColumn.find(c => c._id === overColumn._id)

          // reupdate the value of cards and cardOrderIds in targerColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = targetColumn.cards.map(c => c._id)

          return nextColumn
        })

      }
    }

    // handle drag and drop for column in board content
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id)
    {
      const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
      const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
  
      // arrayMove is used to rearrange the original Columns
      const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns: ', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
    
    // all the data after dnd always must be set to null
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <DndContext 
      sensors={sensors}
      //collision detection algorithm ( thuật toán phát hiện va chạm ), ( fix bug drag big card to another column)
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd} 
    >
      <div>
        <Box sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}>
          <ListColumns columns={ orderedColumns }/>
          <DragOverlay dropAnimation={dropAnimation}>
            {(!activeDragItemId || !activeDragItemType) && null}
            {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
            {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
          </DragOverlay>
        </Box>
      </div>
    </DndContext>
  )
}

export default BoardContent