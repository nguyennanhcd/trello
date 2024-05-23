import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useState, useEffect } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tạm thời fix cứng boardId, flow chuẩn chỉnh về sau sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL về
    const boardId = '664df71ad78817d5029cb616'
    // call API
    fetchBoardDetailsAPI(boardId).then((boardData) => {
      setBoard(boardData)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board