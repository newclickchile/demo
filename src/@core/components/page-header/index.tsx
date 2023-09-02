// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
import { PageHeaderProps } from './types'
import { Card } from '@mui/material'

const PageHeader = (props: PageHeaderProps) => {
  // ** Props
  const { title, subtitle } = props

  return (
    <Card sx={{ p: 5, background: 'transparent', boxShadow: '10px ' }}>
      <Grid item xs={12}>
        {title}
        {subtitle || null}
      </Grid>
    </Card>
  )
}

export default PageHeader
