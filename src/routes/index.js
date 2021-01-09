const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const connection = require('../database')
const bcrypt = require('bcryptjs')
const adminAuth = require('../middleware/adminAuth')

const Article = require('../database/Article')
const Category = require('../database/Category')
const User = require('../database/User')

const CategoryController = require('../controllers/CategoryController')
const ArticleController = require('../controllers/ArticleController')
const UserController = require('../controllers/UserController')

// database sequelize
connection
  .authenticate()
  .then(() => {
    console.log('Conected in database')
  })
  .catch(error => {
    console.log(error)
  })

// viwes
// home page

router.get('/', (req, res) => {
  Article.findAll({
    order: [['id', 'DESC']],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index', { articles, categories })
    })
  })
})

// categories
router.get('/admin/categories/new', adminAuth, (req, res) => {
  res.render('admin/categories/new')
})

router.get('/category/:slug', (req, res) => {
  const { slug } = req.params
  if (slug) {
    Category.findOne({
      where: {
        slug: slug
      },
      include: [{ model: Article }]
    }).then(category => {
      if (category) {
        Category.findAll().then(categories => {
          res.render('index', {
            articles: category.articles,
            categories: categories
          })
        })
      } else {
        res.redirect('/')
      }
    })
  } else {
    res.redirect('/')
  }
})

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
  const id = req.params.id
  console.log(id)
  if (isNaN(id)) {
    res.redirect('/admin/categories')
  }
  Category.findByPk(id)
    .then(category => {
      if (category) {
        res.render('admin/categories/edit', { category: category })
      } else {
        res.redirect('/admin/categories')
      }
    })
    .catch(erro => {
      res.redirect('/admin/categories')
    })
})

// articles
router.get('/admin/articles/new', adminAuth, (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/articles/new', { categories })
  })
})

// aticle
router.get('/article/:slug', (req, res) => {
  const { slug } = req.params
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if (article) {
      Category.findAll().then(categories => {
        res.render('article', { article, categories })
      })
    } else {
      res.redirect('/')
    }
  })
})

router.get('/admin/article/edit/:id', adminAuth, (req, res) => {
  const { id } = req.params
  Article.findByPk(id).then(article => {
    if (article) {
      Category.findAll().then(categories => {
        res.render('admin/articles/edit', { article, categories })
      })
    } else {
      res.redirect('/')
    }
  })
})

// users
router.get('/admin/users/create', adminAuth, (req, res) => {
  res.render('admin/users/new')
})

router.get('/login', (req, res) => {
  res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
  const { email, password } = req.body
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      const correct = bcrypt.compareSync(password, user.password)
      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect('/admin/articles')
      } else {
        res.redirect('/login')
      }
    } else {
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.user = undefined
  res.redirect('/login')
})

// routes
// Categories
router.get('/admin/categories/', adminAuth, CategoryController.index)
router.post('/categories/save', CategoryController.create)
router.post('/categories/delete', CategoryController.delete)
router.post('/categories/update', CategoryController.update)

// Articles
router.get('/admin/articles', adminAuth, ArticleController.index)
router.post('/articles/save', ArticleController.create)
router.post('/articles/delete', ArticleController.delete)
router.post('/articles/update', ArticleController.update)
router.get('/articles/page/:page', ArticleController.indexPagenation)

// user
router.get('/admin/users', adminAuth, UserController.index)
router.post('/users/create', UserController.create)

module.exports = router
