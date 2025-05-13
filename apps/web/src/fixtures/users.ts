import { UserDto } from "@2pm/core";

export const ANONYMOUS: UserDto = {
  type: "ANONYMOUS",
  data: {
    id: "b08ca226-a153-4349-940d-3aa534dde0a8",
    hash: "nNsMDHZqkoJvW9VKvNsDoG",
    userId: 1,
  },
};

export const AUTHENTICATED: UserDto = {
  type: "AUTHENTICATED",
  data: {
    id: "5a0831c6-7340-4df8-b0a8-2993a8e87020",
    hash: "fFy6QZqQ8RpfR9vQ7tXYo7",
    tag: "jake",
    userId: 1,
  },
};

export const AI: UserDto = {
  type: "AI",
  data: {
    id: "NIKO",
    tag: "niko",
    userId: 1,
    bio: "",
  },
};
