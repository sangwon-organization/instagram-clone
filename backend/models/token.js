const Sequelize = require('sequelize')

module.exports = class Token extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        tokenId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        token: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        expiredAt: {
          type: Sequelize.DATE(3),
          allowNull: true,
        },
        blacklisted: {
          type: Sequelize.BOOLEAN,
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
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'Token',
        tableName: 'tb_token',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        indexes: [{ unique: true, fields: ['token'] }],
      }
    )
  }
  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' })
  }
}
