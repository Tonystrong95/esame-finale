async function invia(id) {
  let res = await fetch(`http://localhost:3001/photoazon/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "1984",
      hashtags: "nuova foto",
    }),
  });
  let json = await res.json();
  console.log(json.msg, res.status);
}
invia(1);
