import React, { Component } from "react";
import { Box } from "grommet/components/Box";
import { Button, Form, FormField, TextArea } from "grommet";
import ProfileCard from "../ProfileCard";
import CardBase from "../common/CardBase";
import ConfirmDialogue from "../common/DialoguePopup";
import ApiService from "../../services/ApiService";
import CircularProgress from "@material-ui/core/CircularProgress";
import Keystore from "../../keystore";
import { compressToEncodedURIComponent as compress } from "lz-string";

export interface IProfileMeta {
  pseudonym: string;
  title: string;
  location: string;
  about: string;
  thumbnailImg: string;
}

export interface IProfileData {
  fullImg: string;
}

export interface IProfileDTO {
  meta: IProfileMeta;
  data: IProfileData;
}

type State = {
  showSidebar: boolean;
  pseudonym: string;
  title: string;
  location: string;
  about: string;
  image: string;
  thumbnailImg: string;
  fullImg: string;
  alertDialogueOpen: boolean;
  alertDialogueTitle: string;
  alertDialogueBody: string;
  saveDialogueOpen: boolean;
  loading: boolean;
  keystore: any;
};

type Props = any;

class CreateProfile extends Component<Props, State> {
  profileDTO: IProfileDTO;
  api: ApiService;

  constructor(props: Props) {
    super(props);

    this.api = new ApiService();

    this.state = {
      showSidebar: false,
      pseudonym: "Test Man X",
      title: "Testing all the things",
      location: "Earth",
      about: "Building the permaweb",
      image: "",
      fullImg: "",
      thumbnailImg: "",
      alertDialogueBody: "",
      alertDialogueTitle: "",
      alertDialogueOpen: false,
      saveDialogueOpen: false,
      loading: false,
      keystore: ""
    };

    this.profileDTO = {
      meta: {
        pseudonym: "",
        title: "",
        location: "",
        about: "",
        thumbnailImg: ""
      },
      data: {
        fullImg: ""
      }
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAboutChange = this.handleAboutChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handlePseudChange = this.handlePseudChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.toggleSaveDialogue = this.toggleSaveDialogue.bind(this);
    this.openAlertDialogue = this.openAlertDialogue.bind(this);
    this.confirmSave = this.confirmSave.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
  }

  componentDidMount() {
    this.setState({
      keystore: Keystore
    });
  }

  handleImageChange(e: any) {
    const file = e.target.files[0];
    const thumbImg = this.parseImage("thumb", file);
    const fullImg = this.parseImage("full", file);
    Promise.all([thumbImg, fullImg])
      .then(res => {
        this.setState({
          thumbnailImg: compress(res[0]),
          fullImg: compress(res[1])
        });
      })
      .catch(error => {
        this.createError(error);
      });
  }

  compressImage(file: string) {
    return compress(file);
  }

  createError(error: string) {
    // Error display logic goes here.
    console.log(error);
  }

  parseImage(imgType: "thumb" | "full", file: any): Promise<string> {
    const width = imgType === "thumb" ? 10 : 180;
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        (img.onload = () => {
          const elem = document.createElement("canvas");
          const ctx: any = elem.getContext("2d");

          const scaleFactor = width / img.width;
          elem.width = width;
          elem.height = img.height * scaleFactor;
          ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
          resolve(ctx.canvas.toDataURL());
        }),
          (fileReader.onerror = error => reject(error));
      };
    });
  }

  handleTitleChange(e: any) {
    this.setState({ title: e.target.value });
  }

  handlePseudChange(e: any) {
    this.setState({ pseudonym: e.target.value });
  }

  handleAboutChange(e: any) {
    this.setState({ about: e.target.value });
  }

  handleLocationChange(e: any) {
    this.setState({ location: e.target.value });
  }

  validateFields(): boolean {
    const { pseudonym, title, about, location } = this.state;
    let alertTitle = "";
    let alertBody = "";
    if (!pseudonym || pseudonym.length < 4 || pseudonym.length > 100) {
      alertTitle = "Invalid Psyeudonym";
      alertBody =
        "You must give a pseudonym between 4 & 100 characters to create a profile.";
      this.openAlertDialogue(alertTitle, alertBody);
      return false;
    }
    if (title && (title.length < 4 || title.length > 100)) {
      alertTitle = "Invalid Title";
      alertBody =
        "You must give a title between 4 & 100 characters to create a profile.";
      this.openAlertDialogue(alertTitle, alertBody);
      return false;
    }
    if (location && (location.length < 4 || location.length > 100)) {
      alertTitle = "Invalid Location";
      alertBody =
        "You must give a location between 4 & 100 characters to create a profile.";
      this.openAlertDialogue(alertTitle, alertBody);
      return false;
    }
    if (about && (about.length < 10 || about.length > 400)) {
      alertTitle = "Invalid About";
      alertBody = "The about section must be between 10 and 400 characters.";
      this.openAlertDialogue(alertTitle, alertBody);
      return false;
    }
    return true;
  }

  saveProfile() {
    if (!this.validateFields()) return;
    this.toggleSaveDialogue();
  }

  confirmSave() {
    this.profileDTO = {
      meta: {
        pseudonym: this.state.pseudonym,
        title: this.state.title,
        location: this.state.location,
        about: this.state.about,
        thumbnailImg: compress(this.state.thumbnailImg)
      },
      data: {
        fullImg: compress(this.state.fullImg)
      }
    };

    this.setState({
      saveDialogueOpen: false,
      loading: true
    });
    this.api
      .postProfile(this.profileDTO, this.state.keystore)
      .then(result => {
        this.openAlertDialogue(
          "Success",
          "Your Profile has been deployed to the Arweave. Your changes should be included in the next block"
        );
        console.log(this.profileDTO);
        this.setState({
          loading: false
        });
      })
      .catch(err => {
        this.openAlertDialogue(
          "Uh-Oh",
          "Looks like there was a problem submitting your Profile to the Arweave. Please check your connectivity and that your wallet has enough funds for the transaction."
        );
        this.setState({
          loading: false
        });
      });
  }

  openAlertDialogue(title: string, body: string) {
    this.setState({
      alertDialogueOpen: true,
      alertDialogueTitle: title,
      alertDialogueBody: body
    });
  }

  toggleSaveDialogue() {
    const saveDialogueOpen = this.state.saveDialogueOpen;
    this.setState({ saveDialogueOpen: !saveDialogueOpen });
  }

  async getAllDocs() {
    console.log(await this.api.getLatestProfileList());
  }

  render() {
    const { title, location, about, pseudonym, fullImg, loading } = this.state;

    return (
      <Box
        direction="row-responsive"
        justify="center"
        align="center"
        pad="large"
        gap="large"
      >
        <Box
          flex
          animation={[
            { type: "fadeIn", delay: 100 },
            { type: "zoomIn", delay: 200 }
          ]}
          responsive
        >
          <CardBase responsive={true}>
            <Form
              style={{ width: "100%" }}
              onSubmit={this.validateFields.bind(this)}
            >
              <FormField
                label="Pseudonym"
                name="pseudonym"
                placeholder="Mark Suckerberg"
                value={pseudonym}
                required
                onChange={this.handlePseudChange}
                validate={{
                  // regexp: /^[a-z0-9]{4,100}/i,
                  message:
                    "You must give choose a pseudonym between 4 & 100 alpha-numeric characters to create a profile."
                }}
              />
              <FormField
                label="Title"
                name="title"
                placeholder="Captain of the Black Pearl"
                value={title}
                onChange={this.handleTitleChange}
              />
              <FormField
                label="Location"
                name="location"
                placeholder="Earth"
                value={location}
                onChange={this.handleLocationChange}
              />
              <FormField
                label="About"
                name="about"
                value={about}
                component={TextArea}
                onChange={this.handleAboutChange}
                placeholder="Tell the permaweb about yourself"
              />
              <Box
                direction="row"
                justify="between"
                margin={{ top: "medium" }}
                pad={{ horizontal: "medium" }}
              >
                {/* <Button type="submit" label="Update" primary /> */}
                <Button
                  label="Submit"
                  type="submit"
                  onClick={this.saveProfile}
                />
                <Button
                  label="Get All Docs"
                  // type="submit"
                  onClick={async () => this.getAllDocs()}
                />
                {loading ? <CircularProgress color="secondary" /> : null}
                <ConfirmDialogue
                  open={this.state.saveDialogueOpen}
                  confirm={{ action: this.confirmSave, text: "Confirm" }}
                  cancel={{ action: this.toggleSaveDialogue, text: "Cancel" }}
                  title="Save Profile"
                  body="Are you sure you want to save this profile to the Arweave network ?"
                />
                <ConfirmDialogue
                  open={this.state.alertDialogueOpen}
                  confirm={{
                    action: () => {
                      this.setState({ alertDialogueOpen: false });
                    },
                    text: "OK"
                  }}
                  title={this.state.alertDialogueTitle}
                  body={this.state.alertDialogueBody}
                />
              </Box>
            </Form>
          </CardBase>
        </Box>
        <Box
          responsive
          flex
          animation={[
            { type: "fadeIn", delay: 400 },
            { type: "zoomIn", delay: 300 }
          ]}
        >
          <ProfileCard
            profile={{ title, location, about, pseudonym, fullImg }}
            handleImageChange={this.handleImageChange}
          />
        </Box>
      </Box>
    );
  }
}

export default CreateProfile;
