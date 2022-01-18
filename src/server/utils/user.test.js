const expect = require("expect");

const { Users } = require("./users");

describe("Users", () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "Mike",
        room: "The office fans",
      },
      {
        id: "2",
        name: "Sam",
        room: "Srucbs Fans",
      },
      {
        id: "3",
        name: "Jose",
        room: "How I met your mother",
      },
    ];
  });

  it("should add new user", () => {
    let users = new Users();
    let user = {
      id: "adsasd",
      name: "WDJ",
      room: "The office fans",
    };

    let reUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });
  it("should return names for the office fans", () => {
    let userList = users.getUserList("The office fans");

    expect(userList).toEqual(["Mike", "Jose"]);
  });

  it("should return names for the Srucbs Fans", () => {
    let userList = users.getUserList("The Srucbs Fans");

    expect(userList).toEqual(["Sam"]);
  });

  it("should find user", () => {
    let userID = "2";
    user = users.getUser(userID);

    expect(user.id).toBe(userID);
  });

  it("should not find user", () => {
    let userID = "150";
    user = users.getUser(userID);

    expect(user).toBeUndefined();
  });

  it("should not remove a user", () => {
    let userID = "108";
    user = users.removeUser(userID);

    expect(user).toBeUndefined();
    expect(users.users.length).toBe(3);
  });
  it("should  remove a user", () => {
    let userID = "1";
    user = users.removeUser(userID);

    expect(user.id).toBe(userID);
    expect(users.users.length).toBe(2);
  });
});
