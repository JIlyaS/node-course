const News = require('../models/News');

module.exports.getNews = async (req, res, next) => {

  try {
    const news = await News.find({}).populate('user');
    const updatedNews = news.map((item) => ({
      id: String(item._id),
      text: item.text,
      title: item.title,
      user: item.user
    }));
    return res.json(updatedNews);
  } catch (err) {
    console.error(err);
  }
}

module.exports.addNews = async (req, res, next) => {
  const { text, title } = req.body;
  try {
    await News.create({
      text,
      title,
      user: req.user._id
    });

    const news = await News.find({}).populate('user');
    const updatedNews = news.map((item) => ({
      id: String(item._id),
      text: item.text,
      title: item.title,
      user: item.user
    }));

    return res.json(updatedNews);
  } catch (err) {
    console.error(err);
  }
}

module.exports.updateNews = async (req, res, next) => {
  const newsId  = req.params.id;
  const { text, title } = req.body;

  try {
    await News.findByIdAndUpdate(newsId, { text, title });
    const news = await News.find({}).populate('user');
    const updatedNews = news.map((item) => ({
      id: String(item._id),
      text: item.text,
      title: item.title,
      user: item.user
    }));
    return res.json(updatedNews);
  } catch (err) {
    console.error(err);
  }
}

module.exports.deleteNews = async (req, res, next) => {
  const newsId  = req.params.id;

  try {
    await News.findByIdAndDelete(newsId);
    const news = await News.find({}).populate('user');
    const updatedNews = news.map((item) => ({
      id: String(item._id),
      text: item.text,
      title: item.title,
      user: item.user
    }));
    return res.json(updatedNews);
  } catch (err) {
    console.error(err);
  }
}