async function invia(id, id2) {
  let res = await fetch(
    "http://localhost:3001/photoazon/" + id + "/photo/" + id2,
    {
      method: "DELETE",
    }
  );
  let json = await res.json();
  console.log(json.msg, res.status);
}
invia(1, 2);
