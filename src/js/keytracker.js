let keysDown = [];

$(window).keydown((event) => {
  const key = event.key;
  if (!keysDown.includes(key)) {
    keysDown.push(key);
  }
});

$(window).keyup((event) => {
  const key = event.key;
  let indexOf = -1;
  if ((indexOf = keysDown.indexOf(key)) != -1) {
    keysDown.splice(indexOf, 1);
  }
});