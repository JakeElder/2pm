import TerminalPromptViewContainer from "@/components/client/TerminalPromptViewContainer";

interface Props {}

const TerminalPromptContainer = ({}: Props) => {
  const submitMessage = async (data: FormData) => {
    "use server";
    console.log(Object.fromEntries(data.entries()));
  };

  return (
    <form action={submitMessage}>
      <TerminalPromptViewContainer />
    </form>
  );
};

export default TerminalPromptContainer;
