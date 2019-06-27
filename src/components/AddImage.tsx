import React from "react";
import CircledImg from "./common/CircledImage";
import PlaceholderImage from "./PlaceholderImage";
import { decompressFromEncodedURIComponent as decompress } from "lz-string";

type Props = {
  image: string;
};

const AddImageComponent = (props: Props) => {
  const { image } = props;
  return image === "" ? (
    <PlaceholderImage />
  ) : (
    <CircledImg image={decompress(image)} />
  );
};

export default AddImageComponent;
