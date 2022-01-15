let expect = require("expect");

let { generateMessage } = require("./message");

describe("Generate Message", () => {
  it("should grnerate correct message object", () => {
    let from = "WED",
      text = "some random text",
      message = generateMessage(from, text);
    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({
      from,
      text,
    });
  });
});
