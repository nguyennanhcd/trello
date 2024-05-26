import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  pointerWithin,
  getFirstCollision,
  closestCorners
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibs/DndKitSensor'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails
}) {
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

  // the last collision ( handle collision detection algorithm)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(board.columns)
  }, [board])

  // In this segment, it's important to use c.cards instead of c.cardOrderIds because, in the handleDragOver step, we will complete the data for cards first before creating cardOrderIds.
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
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

      // oldColumn
      if (nextActiveColumn) {

        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // add placeholdercard if column is empty: when all cards within the column are dragged to another cards, and there isn't a placeholdercard any card in the column
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // reupdate cardOrderIds 
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn) {
        // check that if the current dragging card exists in the overColumn or not, if it exists, remove it first
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //  In the case of dragEnd, the columnId data in the card must be updated after dragging the card between different columns
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Adding current dragging card to overColumn by new index
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // remove placeholdercard if column is empty 
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        // reupdate cardOrderIds 
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      // if function is invoked at handleDragEnd, call API
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumn
        )
      }

      return nextColumn
    })
  }

  const handleDragStart = (event) => {
    // console.log('dragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //
    if (event?.active?.data?.current?.columnId) {
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

    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    // find 2 columns by cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // handle logic here just in case drag card to a different column, if drag card to the original column position, do nothing
    // Because this is the processing part during the drag, handling after the drag is completed is a different issue in the handleDragEnd section.
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  const handleDragEnd = (event) => {

    const { active, over } = event
    //Check if over or active is exist or not ( kéo linh tinh ra ngoài thì return tránh lỗi )
    if (!over || !active) return

    // handle drag and drop for cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
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
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        // handle drag and drop operation within a column
        // take the card original position from oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // take the card new position from overCard
        const newCardIndex = overColumn?.cards.findIndex(c => c._id === overCardId)

        // arrayMove is used to rearrange the original Cards, use the same logic with drag and drop operation in column
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(c => c._id)

        setOrderedColumns(prevColumns => {
          // clone prevColumns and then handle data change
          const nextColumn = cloneDeep(prevColumns)

          // find the Column that we drag and drop
          const targetColumn = nextColumn.find(c => c._id === overColumn._id)

          // reupdate the value of cards and cardOrderIds in targerColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds

          return nextColumn
        })

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }

    // handle drag and drop for column in board content
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
      const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

      // arrayMove is used to rearrange the original Columns
      const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
      setOrderedColumns(dndOrderedColumns)

      moveColumns(dndOrderedColumns)
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

  // Customize the collision detection algorithm to optimize the drag-and-drop functionality for cards between multiple columns.
  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // tìm các điểm giao nhau, va chạm với con trỏ, intersection with pointer
    const pointerIntersection = pointerWithin(args)

    // if pointerIntersection is an empty array, return and do nothing
    // fix flickering bug thoroughly in case: 
    // drag a card with big image cover out of the dnd area
    if (!pointerIntersection?.length) return

    // collisions detection will return an array of collisions here
    // const intersections = !!pointerIntersection?.length 
    //   ? pointerIntersection 
    //   : rectIntersection(args)

    // get first overId in pointerIntersection
    let overId = getFirstCollision(pointerIntersection, 'id')

    if (overId) {
      // if over is a column, we need to find a closest cardId within that collision area by using closestCenter or ClosestCorners.  However, using closestCenter brings a smoother experience 
      const checkColumn = orderedColumns.find(column => column._id === overId)

      if (checkColumn) {
        // console.log('overIdbefore: ', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overIdafter: ', overId)
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      sensors={sensors}
      //collision detection algorithm ( thuật toán phát hiện va chạm ), ( fix bug drag big card to another column)
      // if use closestCorner, there is a flickering bug + data bias
      // collisionDetection={closestCenter}

      // custom collision detection
      collisionDetection={collisionDetectionStrategy}
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
          <ListColumns
            columns={orderedColumns}
            createNewColumn={createNewColumn}
            createNewCard={createNewCard}
            deleteColumnDetails={deleteColumnDetails}
          />
          <DragOverlay dropAnimation={dropAnimation}>
            {(!activeDragItemId || !activeDragItemType) && null}
            {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
            {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
          </DragOverlay>
        </Box>
      </div>
    </DndContext>
  )
}

export default BoardContent