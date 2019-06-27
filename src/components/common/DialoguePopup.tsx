import React, { Component } from "react";
import Grow from "@material-ui/core/Grow";
import Dialog from "@material-ui/core/Dialog";
import { Box, Button, Grommet } from "grommet";
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

export interface IConfirmDialgueProps {
  title: string;
  body: string;
  open: boolean;
  confirm: IConfirmDialgueButton;
  cancel?: IConfirmDialgueButton;
  onDismiss?: any
}

export interface IConfirmDialgueButton {
  text: string;
  action: any;
}

const theme = {
  global: {
    breakpoints: {
      small: {
        value: "900"
      }
    },
    font: {
      family: "Raleway",
      size: "14px",
      height: "20px"
    }
  }
};

class DialoguePopup extends Component<IConfirmDialgueProps> {

  constructor(props: IConfirmDialgueProps) {
    super(props);
  }

  render() {
    const { title, body, cancel, confirm, open } = this.props;
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        // keepMounted
        // onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <Grommet theme={theme}>
          <Box direction="column" pad="large">
            <Box fill="horizontal">
              <h2>{title}</h2>
            </Box>
            <p>{body}</p>
            <Box
              fill="horizontal"
              direction="row"
              gap="small"
              align="end"
              justify="end"
            >
              {cancel ? (
                <Button
                  onClick={cancel.action}
                  label={cancel.text}
                  color="accent-3"
                />
              ) : null}
  
              <Button
                label={confirm.text}
                focusIndicator
                primary
                onClick={confirm.action}
              />
            </Box>
          </Box>
        </Grommet>
      </Dialog>
    );
  }

};

export default DialoguePopup;
