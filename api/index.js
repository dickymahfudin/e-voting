const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const models = require("../models");

router.get("/user", async (req, res) => {
  const uid = req.query.uid || null;
  const users = await models.User.findAll();

  if (!uid) {
    return res.json({
      status: "success",
      data: users,
    });
  }

  for (const key in users) {
    if (users.hasOwnProperty(key)) {
      const el = users[key];
      const isUid = await bcrypt.compare(uid, el.uid);
      if (isUid) {
        if (el.status) {
          return res.json({
            status: "sudah",
            id: el.id,
            nama: el.nama,
          });
        }
        return res.json({
          status: "belum",
          id: el.id,
          nama: el.nama,
        });
      }
    }
  }
  return res.status(404).json({
    status: "error",
  });
});

router.post("/user", async (req, res) => {
  const { nama, uid } = req.body;
  const uidHash = await bcrypt.hash(uid, 10);
  const data = { nama, uid: uidHash };
  const createUser = await models.User.create(data);
  return res.status(201).json({
    status: "success",
    data: createUser,
  });
});

router.put("/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = await models.User.findByPk(id);
  const status = true;

  await user.update({ status });
  return res.status(201).json({
    status: "success",
    data: user,
  });
});

router.get("/candidate", async (req, res) => {
  const candidates = await models.Candidate.findAll();
  return res.json(candidates);
});

router.post("/result", async (req, res) => {
  const { selection, id } = req.body;
  console.log({ selection, id });
  const status = true;
  const user = await models.User.findByPk(id);
  user.update({ status });
  const selectionHash = await bcrypt.hash(selection, 10);
  await models.Result.create({ selection: selectionHash });
  return res.status(201).json({
    status: "succes",
  });
});
module.exports = router;
