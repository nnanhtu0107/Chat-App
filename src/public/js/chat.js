let socket = io();

let scrollToButtom = () => {
  let messages = document.querySelector("#messages").lastElementChild;
  messages.scrollIntoView();
};

socket.on("connect", () => {
  let searchQuery = window.location.search.substring(1);
  let params = JSON.parse(
    '{" ' +
      decodeURI(searchQuery)
        .replace(/&/g, '","')
        .replace(/\+/g, "")
        .replace(/=/g, '":"') +
      ' "}'
  );
  socket.emit("join", params, (err) => {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No err");
    }
  });
});
socket.on("disconnect", () => {
  console.log("Disconnected from server.");
});

socket.on("newMessage", function (message) {
  let formattedTime = moment(message.createdAt).format("LT");
  const template = document.querySelector("#message-template").innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  });
  const div = document.createElement("div");
  div.innerHTML = html;

  document.querySelector("#messages").appendChild(div);
  scrollToButtom();
});

socket.on("newLocationMessage", (message) => {
  let formattedTime = moment(message.createdAt).format("LT");
  console.log("newLocationMessage", message);
  const template = document.querySelector(
    "#location-message-template"
  ).innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  });
  const div = document.createElement("div");
  div.innerHTML = html;

  document.querySelector("#messages").appendChild(div);
});

document.querySelector("#submit-btn").addEventListener("click", (e) => {
  e.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: document.querySelector('input[name="message"]').value,
    },
    function () {}
  );
});

document.querySelector("#send-location").addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supperted by your browser.");
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      socket.emit("createLocationMessage", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    () => {
      alert("Unable to fetch location.");
    }
  );
});
module.exports = {
  scrollToButtom,
};
