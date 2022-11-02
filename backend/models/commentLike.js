const Sequelize = require('sequelize')

module.exports = class CommentLike extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        commentId: {
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
        modelName: 'CommentLike',
        tableName: 'tb_comment_like',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.CommentLike.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' })
    db.CommentLike.belongsTo(db.Comment, { foreignKey: 'commentId', targetKey: 'commentId' })
  }
}
