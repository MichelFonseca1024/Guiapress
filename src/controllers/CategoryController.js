const Sequelize = require('sequelize')
const slugify = require('slugify')
const Category = require('../database/Category')

module.exports = {
  async index (req, res) {
    Category.findAll().then(categories => {
      res.render('admin/categories/index', { categories })
    })
  },

  async create (req, res) {
    const title = req.body.title
    console.log(title)
    if (title) {
      Category.create({
        title,
        slug: slugify(title)
      }).then(() => {
        res.redirect('/admin/categories')
      })
    } else {
      res.redirect('/admin/categories/new')
    }
  },

  async delete (req, res) {
    const id = req.body.id
    if (id && !isNaN(id)) {
      Category.destroy({
        where: {
          id
        }
      }).then(() => {
        res.redirect('/admin/categories')
      })
    } else {
      res.redirect('/admin/categories')
    }
  },

  async update (req, res) {
    const id = req.body.id
    const title = req.body.title

    Category.update(
      {
        title: title,
        slug: slugify(title)
      },
      {
        where: {
          id: id
        }
      }
    ).then(() => {
      res.redirect('/admin/categories')
    })
  }
}
