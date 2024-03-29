async function invia() {
  let res = await fetch(`http://localhost:3001/photoazon`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  let json = await res.json();
  console.log(json, res.status);
}
invia();
