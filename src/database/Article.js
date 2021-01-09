const Sequelize = require('sequelize')
const connection = require('./index')
const Category = require('./Category')

const Article = connection.define('articles', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

Category.hasMany(Article) //  UMA CATEGARIA POSSUI VARIOS ARTIGOS
Article.belongsTo(Category) // UM ARTIGO PERTENCE A UMA CATEGORIA

module.exports = Article
