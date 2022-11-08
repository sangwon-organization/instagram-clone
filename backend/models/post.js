const Sequelize = require('sequelize')

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        postId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE(3),
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE(3),
          allowNull: false,
          defaultValue: Sequelize.NOW,
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
        modelName: 'Post',
        tableName: 'tb_post',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        updatedAt: 'updateTimestamp',
      }
    )
  }
  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' })
    db.Post.hasMany(db.PostLike, { foreignKey: 'postId', sourceKey: 'postId' })
    db.Post.hasMany(db.Comment, { foreignKey: 'postId', sourceKey: 'postId' })
    db.Post.hasMany(db.PostImage, { foreignKey: 'postId', sourceKey: 'postId' })
    db.Post.hasMany(db.PostBookmark, { foreignKey: 'postId', sourceKey: 'postId' })
  }
}
