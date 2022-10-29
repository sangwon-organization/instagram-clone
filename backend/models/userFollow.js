const Sequelize = require('sequelize')

module.exports = class UserFollow extends Sequelize.Model {
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
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'UserFollow',
        tableName: 'tb_user_follow',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.UserFollow.belongsTo(db.User, { foreignKey: 'fromUserId', targetKey: 'userId' })
    db.UserFollow.belongsTo(db.User, { foreignKey: 'toUserId', targetKey: 'userId' })
  }
}
