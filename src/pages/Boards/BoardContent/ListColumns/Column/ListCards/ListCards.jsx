import Box from '@mui/material/Box'
import Card from './Card/Card'


function ListCards() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap:1,
      // trick css for beautiful scrollbar
      p: '0 5px',
      m: '0 5px',

      overflowX: 'hidden',
      overflowY: 'auto !important',
      maxHeight:  (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${theme.trello.columnHeaderHeight} - ${theme.trello.columnFooterHeight} )`,
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
      <Card/>
      <Card temporaryHideMedia/>
    </Box>

  )
}

export default ListCards