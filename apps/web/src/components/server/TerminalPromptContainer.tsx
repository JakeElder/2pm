import TerminalPromptViewContainer from "@/components/client/TerminalPromptViewContainer";

interface Props {}

const TerminalPromptContainer = ({}: Props) => {
  const submitMessage = async (data: FormData) => {
    "use server";
    console.log(Object.fromEntries(data.entries()));
  };

  return <TerminalPromptViewContainer />;
};

export default TerminalPromptContainer;
