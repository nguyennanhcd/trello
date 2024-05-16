import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import PersonIcon from '@mui/icons-material/Person'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'

function Card({ temporaryHideMedia }) {
  if (temporaryHideMedia)
  {
    return (
      <MuiCard sx={{ 
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow:'unset'
      }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Ngọc Dung</Typography>
        </CardContent>
      </MuiCard>
    )
  }
  return (
    <MuiCard sx={{ 
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
    </MuiCard>
  )
}

export default Card