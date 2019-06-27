import React from "react";
import { Box } from "grommet/components/Box";

const PlaceholderImage = () => {
  return (
    <Box border={{color: 'lightgrey', style: 'dashed'}} round="full" align="center" justify="center" fill>
      No Image Selected.
    </Box>
  );
};

export default PlaceholderImage;
