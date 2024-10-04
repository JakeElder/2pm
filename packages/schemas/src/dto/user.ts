import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "../drizzle/schema";
import { createZodDto } from "@anatine/zod-nestjs";

const UserDtoSchema = createSelectSchema(users);
const CreateUserDtoSchema = createInsertSchema(users);

class UserDto extends createZodDto(UserDtoSchema) {}
class CreateUserDto extends createZodDto(CreateUserDtoSchema) {}

export { UserDtoSchema, UserDto, CreateUserDto, CreateUserDtoSchema };
