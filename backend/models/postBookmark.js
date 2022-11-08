const Sequelize = require('sequelize')

module.exports = class PostBookmark extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        postId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        createdAt: {
          type: Sequelize.DATE(3),
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE(3),
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'PostBookmark',
        tableName: 'tb_post_bookmark',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.PostBookmark.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' })
    db.PostBookmark.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'postId' })
  }
}
