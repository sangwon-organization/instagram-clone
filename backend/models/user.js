const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        username: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        bio: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        profileImageId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        lastLoginAt: {
          type: Sequelize.DATE(3),
          allowNull: true,
          defaultValue: Sequelize.NOW,
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
        modelName: 'User',
        tableName: 'tb_user',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        indexes: [{ unique: true, fields: ['email'] }],
      }
    )
  }
  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: 'userId', sourceKey: 'userId' })
    db.User.hasMany(db.UserFollow, { as: 'FromUserFollow', foreignKey: 'fromUserId', sourceKey: 'userId' })
    db.User.hasMany(db.UserFollow, { as: 'ToUserFollow', foreignKey: 'toUserId', sourceKey: 'userId' })
    db.User.hasMany(db.PostLike, { foreignKey: 'userId', sourceKey: 'userId' })
    db.User.hasMany(db.Comment, { foreignKey: 'userId', sourceKey: 'userId' })
    db.User.hasMany(db.CommentLike, { foreignKey: 'userId', sourceKey: 'userId' })
    db.User.hasMany(db.Token, { foreignKey: 'userId', sourceKey: 'userId' })
    db.User.hasMany(db.PostBookmark, { foreignKey: 'userId', sourceKey: 'userId' })
    db.User.belongsTo(db.Image, { foreignKey: 'profileImageId', targetKey: 'imageId' })
    db.User.hasMany(db.UserSearchLog, { foreignKey: 'fromUserId', sourceKey: 'userId' })
    db.User.hasMany(db.UserSearchLog, { foreignKey: 'toUserId', sourceKey: 'userId' })
  }
}
