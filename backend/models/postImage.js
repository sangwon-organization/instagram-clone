const Sequelize = require('sequelize')

module.exports = class PostImage extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        postId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        imageId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'PostImage',
        tableName: 'tb_post_image',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.PostImage.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'postId' })
    db.PostImage.belongsTo(db.Image, { foreignKey: 'imageId', targetKey: 'imageId' })
  }
}
