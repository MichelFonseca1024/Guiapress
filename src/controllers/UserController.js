// const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const User = require('../database/User')

module.exports = {
  async index (req, res) {
    User.findAll().then(users => {
      res.render('admin/users/index.ejs', { users })
    })
  },
  async create (req, res) {
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    User.findOne({ where: { email } }).then(user => {
      if (user) {
        res.redirect('/admin/users/create')
      } else {
        User.create({
          email,
          password: hash
        })
          .then(() => {
            res.redirect('/')
          })
          .catch(error => {
            res.send(error)
          })
      }
    })
  }
}
