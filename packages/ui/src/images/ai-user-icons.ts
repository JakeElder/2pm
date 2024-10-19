import { AiUserCode } from "@2pm/data";
import G from "../../public/images/ai-user-list-icons/G.png";
import IVAN from "../../public/images/ai-user-list-icons/IVAN.png";
import THE_HOSTESS from "../../public/images/ai-user-list-icons/THE_HOSTESS.png";
import { StaticImageData } from "next/image";

const aiUserIcons: Record<AiUserCode, StaticImageData> = {
  G,
  IVAN,
  THE_HOSTESS,
};

export default aiUserIcons;
