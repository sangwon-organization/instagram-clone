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
      },
      {
        sequelize,
        timestamps: true,
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
    db.UserFollow.belongsTo(db.User, { as: 'FromUserFollow', foreignKey: 'fromUserId', targetKey: 'userId' })
    db.UserFollow.belongsTo(db.User, { as: 'ToUserFollow', foreignKey: 'toUserId', targetKey: 'userId' })
  }
}
