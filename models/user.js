const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 🧩 تعريف Schema الخاصة بـ User
const userSchema = new mongoose.Schema({
  user_id: Number,
  name: String,
  position: String,
  title: String
});

// 🧱 إنشاء الموديل
const User = mongoose.model('User', userSchema);


// 🟢 POST - إضافة مستخدم جديد
router.post("/newUser", async (req, res) => {
  try {
    const { user_id, name, position, title } = req.body;

    if (!user_id || !name || !position || !title) {
      return res.status(400).json({
        error: "البيانات غير مكتملة",
        message: "user_id, name, position, title مطلوبين"
      });
    }

    const newUser = new User({ user_id, name, position, title });
    await newUser.save();

    res.status(201).json({
      message: "✅ تم حفظ المستخدم بنجاح",
      user: newUser
    });

  } catch (err) {
    res.status(500).json({
      error: "❌ فشل في إنشاء المستخدم",
      details: err.message
    });
  }
});


// 🔵 GET - جلب كل المستخدمين
router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "❌ فشل في جلب المستخدمين", details: err.message });
  }
});


// 🔵 GET - جلب مستخدم بالـ ID
router.get("/findUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "المستخدم غير موجود" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "❌ فشل في جلب المستخدم", details: err.message });
  }
});


// 🟡 PUT - تحديث بيانات المستخدم
router.put("/updateUser/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "المستخدم غير موجود" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "❌ فشل في التحديث", details: err.message });
  }
});


// 🔴 DELETE - حذف مستخدم
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "المستخدم غير موجود" });
    res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
  } catch (err) {
    res.status(500).json({ error: "❌ فشل في حذف المستخدم", details: err.message });
  }
});

module.exports = router;