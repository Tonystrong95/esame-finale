import { log } from "node:console";
import fs from "node:fs/promises";
export async function readDb() {
  let content = await fs.readFile("./db.json");
  let stringContent = content.toString();
  let db = JSON.parse(stringContent);

  return db;
}

export async function getAll(req, res) {
  let db = await readDb();
  res.status(200).json({ photoazon: db.photoazon });
}
let index = 1;
export async function createAlbum(req, res) {
  let db = await readDb();
  let keys = Object.keys(req.body);

  if (keys.length === 2 && !(await nameExsist(req.body.name))) {
    console.log("entrato nel primo if");
    let album = {
      id: index,
      name: req.body.name,
      photo: [],
      hashtags: req.body.hashtags,
      creationData: new Date(),
      modifyDate: null,
    };
    db.photoazon.push(album);
    await fs.writeFile("./db.json", JSON.stringify(db));

    res.status(201).json({ status: "ok", msg: "created" });
    index++;
  } else {
    res.status(400).json({ msg: "The Fields are not valid" });
  }
}

export async function createPhoto(req, res) {
  let db = await readDb();
  let keys = Object.keys(req.body);

  if (keys.length === 2 && !(await namExsist(req.body.name))) {
    for (let i = 0; i < db.photoazon.length; i++) {
      if (db.photoazon[i].id === parseInt(req.params.id, 10)) {
        let ind = 1;

        for (let j = 0; j < db.photoazon[i].photo.length; j++) {
          if (
            db.photoazon[i].photo[j].id &&
            j === db.photoazon[i].photo.length - 1
          ) {
            ind =
              db.photoazon[i].photo[db.photoazon[i].photo.length - 1].id + 1;
          }
        }
        let phot = {
          id: ind,
          name: req.body.name,
          creationData: new Date(),
          modifyDate: null,
          hashtags: req.body.hashtags,
        };
        let inPhoto = [...db.photoazon[i].photo, phot];

        db.photoazon[i].photo = inPhoto;

        break;
      }
    }
    await fs.writeFile("./db.json", JSON.stringify(db));

    res.status(201).json({ msg: "created" });
  } else {
    res.status(400).json({ msg: "The Fields are not valid" });
  }
}

export async function deleteAlbum(req, res) {
  let db = await readDb();
  if (await searchId(req.params.id)) {
    let newPhotoazon = [];
    for (let i = 0; i < db.photoazon.length; i++) {
      if (db.photoazon[i].id !== parseInt(req.params.id, 10)) {
        newPhotoazon.push(db.photoazon[i]);
      }
    }
    db.photoazon = newPhotoazon;
    await fs.writeFile("./db.json", JSON.stringify(db));
    res.status(200).json({ msg: "delete album with id : " + req.params.id });
  } else {
    res.status(400).json({ msg: "not found" });
  }
}

async function searchId(id) {
  let db = await readDb();
  let found = false;
  for (let i = 0; i < db.photoazon.length; i++) {
    if (db.photoazon[i].id === parseInt(id, 10)) {
      found = true;
      break;
    }
  }
  return found;
}

export async function editAlbum(req, res) {
  let db = await readDb();
  if ((await searchId(req.params.id)) && !(await nameExsist(req.body.name))) {
    for (let i = 0; i < db.photoazon.length; i++) {
      if (db.photoazon[i].id === parseInt(req.params.id)) {
        db.photoazon[i].name = req.body.name;
        db.photoazon[i].hashtags = req.body.hashtags;
        db.photoazon[i].modifyDate = new Date();
        break;
      }
    }
    await fs.writeFile("./db.json", JSON.stringify(db));
    res.status(200).json({ msg: "update" });
  } else {
    res.status(400).json({ msg: "not found" });
  }
}

export async function editPhoto(req, res) {
  let db = await readDb();
  let found = await searchPhotoId(req.params.photoazonId, req.params.photoId);
  let album = parseInt(req.params.photoazonId);
  let phot = parseInt(req.params.photoId);
  if ((await searchId(req.params.photoazonId)) && found) {
    db.photoazon[album - 1].photo[phot - 1].name = req.body.name;
    db.photoazon[album - 1].photo[phot - 1].hashtags = req.body.hashtags;
    db.photoazon[album - 1].photo[phot - 1].modifyDate = new Date();

    await fs.writeFile("./db.json", JSON.stringify(db));
    res.status(200).json({ msg: "update photo" });
  } else {
    res.status(400).json({ msg: "not found" });
  }
}

async function searchPhotoId(albumId, photoId) {
  let db = await readDb();
  let found = false;

  let album = parseInt(albumId);
  for (let i = 0; i < db.photoazon[album - 1].photo.length; i++) {
    if (db.photoazon[album - 1].photo[i].id === parseInt(photoId)) {
      found = true;

      break;
    }
  }
  return found;
}
export async function deletePhoto(req, res) {
  let db = await readDb();
  console.log(req.params);
  if (await searchId(req.params.photoazonId)) {
    let newPhoto = [];
    let count = 0;
    let completed = false;
    for (let i = 0; i < db.photoazon.length; i++) {
      if (completed) {
        break;
      }
      if (db.photoazon[i].id === parseInt(req.params.photoazonId)) {
        for (let j = 0; j < db.photoazon[i].photo.length; j++) {
          if (db.photoazon[i].photo[j].id !== parseInt(req.params.photoId)) {
            newPhoto.push(db.photoazon[i].photo[j]);
            count++;
          }
          if (count === db.photoazon[i].photo.length - 1) {
            db.photoazon[i].photo = newPhoto;
            completed = true;
            break;
          }
        }
      }
    }
    await fs.writeFile("./db.json", JSON.stringify(db));
    res.status(200).json({ msg: "delete photo" });
  } else {
    res.status(400).json({ msg: " not found photo" });
  }
}
async function nameExsist(name) {
  let db = await readDb();
  let found = false;
  for (let i = 0; i < db.photoazon.length; i++) {
    if (db.photoazon[i].name == name) {
      found = true;
      break;
    }
  }
  return found;
}

async function namExsist(name) {
  let db = await readDb();
  let found = false;
  for (let i = 0; i < db.photoazon.length; i++) {
    if (found) {
      break;
    }
    for (let j = 0; j < db.photoazon[i].photo.length; j++) {
      if (db.photoazon[i].photo[j].name === name) {
        found = true;
        break;
      }
    }
  }
  return found;
}
