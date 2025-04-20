import short from "short-uuid";
const translator = short();

const shorten = (uuid: string) => {
  const hash = translator.fromUUID(uuid);
  return hash;
};

export default shorten;
