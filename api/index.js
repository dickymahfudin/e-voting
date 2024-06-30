const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const models = require("../models");

router.get("/user", async (req, res) => {
  const uid = req.query.uid || null;
  const users = await models.User.findAll();

  if (!uid) {
    return res.json({
      status: "success",
      data: users[0],
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
  const { name } = req.body;
  const ektp = await models.Temp.findByPk(1);
  const data = { nama: name, uid: ektp.ektp };
  ektp.ektp = null;
  await ektp.save();
  await models.User.create(data);
  return res.redirect("/");
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

router.get("/result/percentage", async (req, res) => {
  const results = await models.Result.findAll();
  const totalUser = await models.User.count();
  const totalVoted = await models.User.count({ where: { status: true } });
  let satu = 0,
    dua = 0,
    tiga = 0;

  await Promise.all(
    results.map(async el => {
      const isSatu = await bcrypt.compare("satu", el.selection);
      const isDua = await bcrypt.compare("dua", el.selection);
      const isTiga = await bcrypt.compare("tiga", el.selection);
      if (isSatu) satu++;
      if (isDua) dua++;
      if (isTiga) tiga++;
    })
  );

  const satuPercentage = (satu / totalUser) * 100;
  const duaPercentage = (dua / totalUser) * 100;
  const tigaPercentage = (tiga / totalUser) * 100;

  return res.json({
    status: "success",
    satu: satuPercentage.toFixed(2),
    dua: duaPercentage.toFixed(2),
    tiga: tigaPercentage.toFixed(2),
    totalUser,
    totalVoted,
  });
});

router.get("/reset/result", async (req, res) => {
  await models.Result.destroy({ where: {} });
  await models.User.update({ status: false }, { where: { status: true } });
  return res.status(200).json({ status: "success", message: "Delete All Data Result " });
});

router.post("/post/result", async (req, res) => {
  const { selection, uid } = req.body;

  const status = true;
  if (selection === "satu" || selection === "dua" || selection === "tiga") {
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

router.post("/register", async (req, res) => {
  const { uid } = req.body;
  console.log({ uid });
  console.log(req.headers);
  const findEktp = await models.Temp.findByPk(1);
  const ektp = await bcrypt.hash(uid, 10);
  if (findEktp) {
    await findEktp.update({ ektp });
  } else {
    await models.Temp.create({ ektp });
  }
  return res.status(201).json({ status: "success" });
});

router.get("/apa", (req, res) => {
  return res.status(409).json({
    status: "error",
    message: "User Sudah Memilih",
  });
});

module.exports = router;
