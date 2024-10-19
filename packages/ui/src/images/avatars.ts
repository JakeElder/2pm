import { AiUserCode } from "@2pm/data";
import G from "../../public/images/avatars/G.png";
import IVAN from "../../public/images/avatars/IVAN.png";
import THE_HOSTESS from "../../public/images/avatars/THE_HOSTESS.png";
import { StaticImageData } from "next/image";

const avatars: Record<AiUserCode, StaticImageData> = {
  G,
  IVAN,
  THE_HOSTESS,
};

export default avatars;
