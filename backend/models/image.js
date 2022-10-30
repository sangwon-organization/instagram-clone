const Sequelize = require('sequelize')

module.exports = class Image extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        imageId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        imagePath: {
          type: Sequelize.STRING(255),
          allowNull: true,
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
        modelName: 'Image',
        tableName: 'tb_image',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.Image.hasMany(db.PostImage, { foreignKey: 'imageId', sourceKey: 'imageId' })
  }
}
