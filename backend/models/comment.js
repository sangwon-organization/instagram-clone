const Sequelize = require('sequelize')

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        commentId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        parentCommentId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: true,
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
        postId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'Comment',
        tableName: 'tb_comment',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' })
    db.Comment.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'postId' })
    db.Comment.hasMany(db.CommentLike, { foreignKey: 'commentId', sourceKey: 'commentId' })
  }
}
