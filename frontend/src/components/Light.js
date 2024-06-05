import React from 'react'
import {Box, Divider, Typography} from '@mui/material'
import LayersIcon from '@mui/icons-material/Layers';

export default ({title, icon, mt, marginBottom = 10, marginTop = 10}) => {
  return (
    <Box mt={mt} style={{marginBottom, marginTop}}>
      <Typography style={{marginBottom: 6, display: 'inline-flex'}}>
        <LayersIcon style={{marginRight: 6, marginTop: 6, color: '#aaa'}} />
        <span style={{fontSize: 24}}>{title}</span>&nbsp;
        <span style={{marginRight: 6}}>{icon}</span>
      </Typography>
      <Divider />
    </Box>
  )
}
