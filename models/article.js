const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 🧩 تعريف Schema الخاصة بـ Article
const articleSchema = new mongoose.Schema({
  title: String,
  body: String,
  nooflikes: {
    type: Number,
    default: 0
  }
});

// 🧱 إنشاء الموديل
const Article = mongoose.model('Article', articleSchema);

// 🟢 POST - إضافة مقال جديد
router.post("/newArticle", async (req, res) => {
  try {
    const { title, body, nooflikes } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        error: "البيانات غير مكتملة",
        message: "title و body مطلوبين"
      });
    }

    const newArticle = new Article({ title, body, nooflikes });
    await newArticle.save();

    res.status(201).json({
      message: "✅ تم حفظ المقال بنجاح",
      article: newArticle
    });

  } catch (err) {
    res.status(500).json({
      error: "❌ فشل في إنشاء المقال",
      details: err.message
    });
  }
});

// 🔵 GET - جلب كل المقالات
router.get("/getAllArticles", async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: "❌ فشل في جلب المقالات", details: err.message });
  }
});

// 🔵 GET - جلب مقال بالـ ID
router.get("/findArticle/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "المقال غير موجود" });
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ error: "❌ فشل في جلب المقال", details: err.message });
  }
});

// 🟡 PUT - تحديث المقال
router.put("/updateArticle/:id", async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "المقال غير موجود" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "❌ فشل في التحديث", details: err.message });
  }
});

// 🔴 DELETE - حذف مقال
router.delete("/deleteArticle/:id", async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "المقال غير موجود" });
    res.status(200).json({ message: "تم حذف المقال بنجاح" });
  } catch (err) {
    res.status(500).json({ error: "❌ فشل في حذف المقال", details: err.message });
  }
});

module.exports = router;