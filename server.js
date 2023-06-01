const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrls');
const app = express();
require('dotenv').config();
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.MONGO_URL,{})

app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', {shortUrls : shortUrls});
});

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({fullUrl: req.body.fullURL});
    res.redirect('/');
});
app.get('/:shortUrl', async (req, res) => {
  const data = await ShortUrl.findOne({shortUrl: req.params.shortUrl});
  if(data == null) return res.sendStatus(404);
  data.clicks ++;
  data.save();
  res.redirect(data.fullUrl);
});
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening on ${port}`);
})
