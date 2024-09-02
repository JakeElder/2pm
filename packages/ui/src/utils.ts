import emailRegex from "email-regex";

export function replaceEmailsWithMarkdown(input: string): string {
  return input.replace(emailRegex(), (match) => {
    return `[${match}](mailto:${match})`;
  });
}

export function processMessageBody(input: string): string {
  return replaceEmailsWithMarkdown(input);
}
