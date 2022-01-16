let expect = require("expect");

let { generateMessage, generateLocationMessage } = require("./message");

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
describe("Generate Location Message", () => {
  if (
    ("Should generate correct location object",
    () => {
      let from = "Claire",
        lat = 15,
        lng = 56,
        url = `https://www.google.com/maps/place/${lat},${lng}`,
        message = generateLocationMessage(from, lat, lng);
      expect(typeof message.createdAt).toBe("number");
      expect(message).toMatchObject({ from, url });
    })
  );
});
