const Sequelize = require('sequelize')

module.exports = class PostLike extends Sequelize.Model {
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
        modelName: 'PostLike',
        tableName: 'tb_post_like',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.PostLike.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' })
    db.PostLike.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'postId' })
  }
}
