import React from "react";
import { Box } from "grommet/components/Box";

type Props = {
  image: string;
};

const CircledImg = (props: Props) => {
  const { image } = props;
  //  console.log(image)
  const divStyle = {
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '50%'
};

  return (
    <div style={divStyle}>
    </div>
  );
};

export default CircledImg;
