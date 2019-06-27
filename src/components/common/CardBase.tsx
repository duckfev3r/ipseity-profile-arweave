import React from "react";
import { Box } from "grommet/components/Box";

const CardBase = (props: any) => {
  return (
    <Box
      round="medium"
      animation="fadeIn"
      elevation="medium"
      background="light-1"
      responsive
      pad={{ vertical: "medium", horizontal: "small" }}
      {...props}
    />
  );
};

export default CardBase;
