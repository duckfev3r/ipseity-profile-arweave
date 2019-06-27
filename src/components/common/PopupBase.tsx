import React from "react";
import { Box, Button, Layer } from "grommet";
import CardBase from "./CardBase";

function PopupBase(props: any) {
  const [show, setShow] = React.useState();
  return (
    <Box>
      <Button label="show" onClick={() => setShow(true)} />
      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
          animate
          modal
          margin="large"
          plain
          responsive
          position="center"
        >
          <CardBase>
            <h1>Hello</h1>
            <Button label="close" onClick={() => setShow(false)} />
          </CardBase>
        </Layer>
      )}
    </Box>
  );
}

export default PopupBase;
