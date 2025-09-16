const express = require('express');
const methodOverride = require('method-override');
const path = require('path');

const app = express();  
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

let posts = [];
const categories = ['Tech', 'Lifestyle', 'Education', 'Food', 'Travel', 'Other'];

app.get('/', (req, res) => {
  const categoryFilter = req.query.category;
  let filteredPosts = posts;
  
  if (categoryFilter) {
    filteredPosts = posts.filter(post => post.category === categoryFilter);
  }
  
  res.render('home', { 
    posts: filteredPosts, 
    categories,
    currentCategory: categoryFilter 
  });
});

app.get('/posts/new', (req, res) => {
  res.render('post-form', { categories, post: null });
});

app.post('/posts', (req, res) => {
  const { title, author, content, category } = req.body;
  const newPost = {
    id: Date.now().toString(),
    title,
    author,
    content,
    category,
    createdAt: new Date()
  };
  posts.unshift(newPost);
  res.redirect('/');
});

app.get('/posts/:id/edit', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  res.render('edit-form', { post, categories });
});

app.put('/posts/:id', (req, res) => {
  const { title, author, content, category } = req.body;
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  
  if (postIndex > -1) {
    posts[postIndex] = {
      ...posts[postIndex],
      title,
      author,
      content,
      category
    };
  }
  
  res.redirect('/');
});

app.delete('/posts/:id', (req, res) => {
  posts = posts.filter(p => p.id !== req.params.id);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});