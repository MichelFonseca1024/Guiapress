const Sequelize = require('sequelize')
const slugify = require('slugify')
const Category = require('../database/Category')
const Article = require('../database/Article')

module.exports = {
  async index (req, res) {
    Article.findAll({
      include: [{ model: Category }]
    }).then(articles => {
      res.render('admin/articles/index', {
        articles
      })
    })
  },
  async create (req, res) {
    const { title, body, categoryId } = req.body
    Article.create({
      title,
      slug: slugify(title),
      body,
      categoryId
    }).then(() => {
      res.redirect('/admin/articles')
    })
  },
  async delete (req, res) {
    const id = req.body.id
    if (id && !isNaN(id)) {
      Article.destroy({
        where: {
          id
        }
      }).then(() => {
        res.redirect('/admin/articles')
      })
    } else {
      res.redirect('/admin/articles')
    }
  },
  async update (req, res) {
    const { title, body, categoryId, id } = req.body

    Article.update(
      {
        title,
        slug: slugify(title),
        body,
        categoryId
      },
      {
        where: { id }
      }
    ).then(() => {
      res.redirect('/admin/articles')
    })
  },
  async indexPagenation (req, res) {
    let { page } = req.params
    if (isNaN(page)) {
      page = 1
    }

    const offset = (parseInt(page) - 1) * 4

    Article.findAndCountAll({
      limit: 4,
      offset,
      order: [['id', 'DESC']]
    }).then(articles => {
      let next
      if (offset + 4 >= articles.count) {
        next = false
      } else {
        next = true
      }
      const result = {
        page: parseInt(page),
        next,
        articles
      }

      Category.findAll().then(categories => {
        res.render('admin/articles/page', { result, categories })
        // res.send({ result, categories })
      })
    })
  }
}
