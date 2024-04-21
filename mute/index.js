async function main() {
  const roomList = document.evaluate(
    "//*[@id='RoomList']/ul/li",
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  for (let i = 0; i < roomList.snapshotLength; i++) {
    const room = roomList.snapshotItem(i);
    addReadButton(room);
    if (!isDm(room.id)) {
      addMuteButton(room);
    }
  }

  function createMuteUrl(rid) {
    return `https://www.chatwork.com/gateway/update_mute_setting.php?myid=${MYID}&_v=1.80a&_av=5&ln=ja&rid=${rid}`;
  }

  function createReadUrl(rid) {
    return `https://www.chatwork.com/gateway/read.php?myid=${MYID}&_v=1.80a&_av=5&ln=ja&room_id=${rid}&unread=0`;
  }

  function isMutedRoom(id) {
    const muteIcon = document.evaluate(
      `//li[@id="${id}"]//*[@href="#icon_mute"]`,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE
    ).singleNodeValue;

    return muteIcon !== null;
  }

  function isDm(id) {
    const icon = document.evaluate(
      `//li[@id="${id}"]//img[contains(@src, "avatar")]`,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE
    ).singleNodeValue;

    return icon !== null;
  }

  function addMuteButton(room) {
    const id = room.id;
    const button = createMuteButton(id);
    room.appendChild(button);
  }

  function addReadButton(room) {
    const id = room.id;
    const button = createReadButton(id);
    room.appendChild(button);
  }

  function createMuteButton(rid) {
    let isMuted = isMutedRoom(rid);

    const button = createStyledButton();
    button.textContent = isMuted ? "ミュート解除" : "ミュート";

    const formData = new FormData();
    formData.append("mute", isMuted ? 0 : 1);
    formData.append("_t", ACCESS_TOKEN);
    const url = createMuteUrl(rid);

    button.addEventListener("click", (e) => {
      e.stopPropagation();

      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          res.json().then((json) => {
            console.log(json);
          });
          isMuted = !isMuted;
          formData.set("mute", isMuted ? 0 : 1);
          button.textContent = isMuted ? "ミュート解除" : "ミュート";
        })
        .catch((err) => {
          console.error(err);
        });
    });

    return button;
  }

  function createReadButton(rid) {
    const button = createStyledButton();
    button.textContent = "既読";

    const formData = new FormData();
    formData.append("_t", ACCESS_TOKEN);
    const url = createReadUrl(rid);

    button.addEventListener("click", (e) => {
      e.stopPropagation();

      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          res.json().then((json) => {
            console.log(json);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    });

    return button;
  }

  function createStyledButton() {
    const button = document.createElement("button");
    button.style.margin = "5px 5%";
    button.style.width = "40%";
    button.style.border = "1px solid #fff";
    button.style.borderRadius = "5px";
    button.style.backgroundColor = "#0D1723";
    button.style.cursor = "pointer";
    button.style.color = "#fff";

    return button;
  }
}

main();
