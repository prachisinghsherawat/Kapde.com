import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationControlled({handleChange,page}) {

  return (
    <Stack id='PageBox' spacing={2}>
      <Typography>Page: {page}</Typography>
      <Pagination id='pagination' count={3} page={page} color='primary' onChange={handleChange} />
    </Stack>
  );
}
