import type { Meta, StoryObj } from "@storybook/react";
import * as HumanPost from "./HumanPost";
import * as Frame from "../../Components/Frame";
import { UserTag } from "../../Components";
import * as users from "../../fixtures/users";
import ImageGrid from "../../Components/ImageGrid";

const meta: Meta<typeof HumanPost.Root> = {
  title: "Plot Points/HumanPost",
  component: HumanPost.Root,
  decorators: [
    (Story) => {
      return (
        <Frame.Generic fill>
          <div
            style={{
              display: "flex",
              height: "100%",
              justifyContent: "stretch",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <Story />
            </div>
          </div>
        </Frame.Generic>
      );
    },
  ],
};

type Story = StoryObj<typeof HumanPost>;

export const Default: Story = {
  render() {
    return (
      <HumanPost.Root>
        <HumanPost.Header>
          <HumanPost.Heading>
            Chiang Mai Food Festival Jan 2025
          </HumanPost.Heading>
          <HumanPost.Text>
            <p>A few snaps from Chiang Mai food festival</p>
            <p>กินข้าวหรือยังครับ</p>
          </HumanPost.Text>
        </HumanPost.Header>
        <HumanPost.Body>
          <HumanPost.Images>
            <ImageGrid />
          </HumanPost.Images>
        </HumanPost.Body>
        <HumanPost.Footer>
          <HumanPost.Tag>
            <UserTag {...users.AUTHENTICATED} />
          </HumanPost.Tag>
          <HumanPost.Date date={new Date(2025, 4, 20, 14, 0, 0)} />
        </HumanPost.Footer>
      </HumanPost.Root>
    );
  },
};

export default meta;
