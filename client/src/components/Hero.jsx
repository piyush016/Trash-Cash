import { Carousel, Image } from "antd";
import Image1 from "../assets/1.svg";
import Image2 from "../assets/2.svg";
import Image3 from "../assets/3.svg";

const Hero = () => {
  return (
    <Carousel
      autoplay
      autoplaySpeed={2000}
      style={{ width: "45vw", height: "70vh" }}
    >
      <div>
        <Image
          src={Image1}
          alt='Image 1'
          preview={false}
          style={{ maxHeight: "60vh", objectFit: "cover" }}
        />
      </div>
      <div>
        <Image
          src={Image2}
          alt='Image 2'
          preview={false}
          style={{ maxHeight: "60vh", objectFit: "cover" }}
        />
      </div>
      <div>
        <Image
          src={Image3}
          alt='Image 3'
          preview={false}
          style={{ maxHeight: "60vh", objectFit: "cover" }}
        />
      </div>
    </Carousel>
  );
};

export default Hero;
