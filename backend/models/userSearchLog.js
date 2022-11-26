const Sequelize = require('sequelize')

module.exports = class UserSearchLog extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        fromUserId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        toUserId: {
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
        modelName: 'UserSearchLog',
        tableName: 'tb_user_search_log',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.UserSearchLog.belongsTo(db.User, { foreignKey: 'fromUserId', targetKey: 'userId' })
    db.UserSearchLog.belongsTo(db.User, { foreignKey: 'toUserId', targetKey: 'userId' })
  }
}
