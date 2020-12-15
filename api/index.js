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
            nama: el.nama,
          });
        }
        return res.json({
          status: "belum",
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
  const { selection, uid } = req.body;
  const status = true;
  if (selection === "satu" || selection === "dua") {
    const users = await models.User.findAll();
    for (const key in users) {
      if (users.hasOwnProperty(key)) {
        const el = users[key];
        const isUid = await bcrypt.compare(uid, el.uid);
        if (isUid) {
          if (!el.status) {
            el.update({ status });
            const selectionHash = await bcrypt.hash(selection, 10);
            await models.Result.create({ selection: selectionHash });
            return res.status(201).json({
              status: "success",
            });
          }
          return res.status(409).json({
            status: "error",
            message: "User Sudah Memilih",
          });
        }
      }
    }
  }
  return res.status(404).json({
    status: "error",
    message: "Kartu Tidak Terdaftar",
  });
});

router.get("/result", async (req, res) => {
  let satu = 0,
    dua = 0;
  const results = await models.Result.findAll();
  await results.reduce(async (promise, el) => {
    const isSatu = await bcrypt.compare("satu", el.selection);
    const isDua = await bcrypt.compare("dua", el.selection);
    isSatu && satu++;
    isDua && dua++;
  }, Promise.resolve());

  return res.json({ status: "success", satu, dua });
});

router.get("/reset/result", async (req, res) => {
  await models.Result.destroy({ where: {} });
  await models.User.update({ status: false }, { where: { status: true } });
  return res
    .status(200)
    .json({ status: "success", message: "Delete All Data Result " });
});

router.get("/post/result", async (req, res) => {
  const { selection, uid } = req.query;
  const status = true;
  if (selection === "satu" || selection === "dua") {
    const users = await models.User.findAll();
    for (const key in users) {
      if (users.hasOwnProperty(key)) {
        const el = users[key];
        const isUid = await bcrypt.compare(uid, el.uid);
        if (isUid) {
          if (!el.status) {
            el.update({ status });
            const selectionHash = await bcrypt.hash(selection, 10);
            await models.Result.create({ selection: selectionHash });
            return res.status(201).json({
              status: "success",
            });
          }
          return res.status(409).json({
            status: "error",
            message: "User Sudah Memilih",
          });
        }
      }
    }
  }
  return res.status(404).json({
    status: "error",
    message: "Kartu Tidak Terdaftar",
  });
});

module.exports = router;
