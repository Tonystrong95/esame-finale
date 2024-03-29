async function invia(id) {
  let res = await fetch("http://localhost:3001/photoazon/" + id, {
    method: "DELETE",
  });
  let json = await res.json();
  console.log(json.status, res.status);
}
invia(1);
