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
          unique: true,
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
        gender: {
          type: Sequelize.CHAR(1),
          allowNull: true,
        },
        bio: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        profileImage: {
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
      }
    )
  }
  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: 'userId', sourceKey: 'userId' })
    db.User.hasMany(db.UserFollow, { foreignKey: 'fromUserId', sourceKey: 'userId' })
    db.User.hasMany(db.UserFollow, { foreignKey: 'toUserId', sourceKey: 'userId' })
    db.User.hasMany(db.PostLike, { foreignKey: 'userId', sourceKey: 'userId' })
    db.User.hasMany(db.Comment, { foreignKey: 'userId', sourceKey: 'userId' })
    db.User.hasMany(db.CommentLike, { foreignKey: 'userId', sourceKey: 'userId' })
    db.User.hasMany(db.Token, { foreignKey: 'userId', sourceKey: 'userId' })
  }
}
