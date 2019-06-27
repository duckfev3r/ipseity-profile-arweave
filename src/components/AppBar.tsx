import React from 'react'
import { Box, Button, Heading, Grommet } from 'grommet';
import { Notification } from 'grommet-icons';

const AppBar = (props: any) => (
    <Box
      tag="header"
      direction="row"
      align="stretch"
      justify="between"
    //   background="brand"
      pad={{ left: "medium", right: "small" }}
      elevation="small"
      style={{ zIndex: "1" }}
      {...props}
    />
  );

export default AppBar