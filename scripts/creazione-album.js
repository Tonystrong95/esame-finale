async function invia(id, id2) {
  let res = await fetch("http://localhost:3001/photoazon/" + id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "old photo",

      hashtags: "  photos ",
    }),
  });

  let json = await res.json();
  console.log(json.msg, res.status);
}
invia(1);
