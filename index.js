const express = require("express");
const mongoose = require("mongoose");


const userRoutes = require('./models/user');

const app = express();

app.use(express.json());
app.use('/users', userRoutes);

const uri = "mongodb://mahmoudhse:Gehad2018@ac-k416yri-shard-00-00.ivk0ahz.mongodb.net:27017,ac-k416yri-shard-00-01.ivk0ahz.mongodb.net:27017,ac-k416yri-shard-00-02.ivk0ahz.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8dgfve-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas!'))
.catch((err) => console.error('❌ MongoDB connection error:', err));


// تعريف الموديل
const articleSchema = new mongoose.Schema({
  title: String,
  body: String,
  nooflikes: Number
});
const Article = mongoose.model("Article", articleSchema);

// 🟢 POST - إضافة مقال جديد
app.post("/newArticle", async (req, res) => {
  try {
    const title = req.body.title;
    const body = req.body.body;
    const nooflikes = req.body.nooflikes || 0;

    // ✅ التحقق من وجود البيانات الأساسية
    if (!title || !body) {
      return res.status(400).json({
        error: "البيانات غير مكتملة",
        message: "العنوان والمحتوى مطلوبين"
      });
    }

    const newArticle = new Article({
      title,
      body,
      nooflikes
    });

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

app.get('/', (req, res) => {
  res.send('Welcome to my Node.js app!');
});


// 🔵 GET - جلب كل المقالات
app.get("/getAllArticles", async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve articles", details: err.message });
  }
});



// 🔵 GET - جلب مقال معين بالـ ID
app.get("/findArticle/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve article", details: err.message });
  }
});

// 🟡 PUT - تحديث مقال موجود
app.put("/updateArticle/:id", async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Article not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update article", details: err.message });
  }
});



// 🔴 DELETE - حذف مقال
app.delete("/deleteArticle/:id", async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Article not found" });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete article", details: err.message });
  }
});

// تشغيل السيرفر
app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});