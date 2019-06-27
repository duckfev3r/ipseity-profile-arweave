import React, { Component } from "react";
import { Box } from "grommet/components/Box";
import { IProfile } from "../types/types";
import CardBase from "./common/CardBase";
import AddImageComponent from "./AddImage";

type Props = {
  profile: IProfile;
  handleImageChange: any;
};

class ProfileCard extends Component<Props> {
  imgInputRef: any;

  constructor(props: Props) {
    super(props);

    this.imgInputRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: any) {
    this.imgInputRef.current.click();
  }

  render() {
    const { handleImageChange } = this.props;
    const { title, pseudonym, location, about, fullImg } = this.props.profile;
    return (
      <CardBase background="light-1" pad='large'>
        <Box
          width="100%"
          responsive
          className="profile-image-container"
          direction="row-responsive"
        >
          <Box
            onClick={this.handleClick}
            height="small"
            width="small"
            className="profile-image-container"
          >
            <AddImageComponent image={fullImg} />
            <input
              accept=".jpeg, .png"
              type="file"
              id="file"
              ref={this.imgInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </Box>
          <Box
          pad={{ horizontal: 'small', top: 'medium' }}
          >
            <h2>{pseudonym ? pseudonym : 'Your Pseudonym'}</h2>
            <h3>{title ? title : 'Your Title'}</h3>
            <i>{location ? location : 'Location'}</i>
          </Box>
        </Box>
        <Box pad={{horizontal: 'large'}}>
          <p>{about}</p>
        </Box>
      </CardBase>
    );
  }
}

export default ProfileCard;
