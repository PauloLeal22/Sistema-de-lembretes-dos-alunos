const Model = require('sequelize').Model
const DataTypes = require('sequelize').DataTypes

class Post extends Model{
    static init(sequelize){
        super.init({
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            assunto: DataTypes.TEXT,
            isread: DataTypes.BOOLEAN
        }, {
            sequelize,
            tableName: 'posts'
        })
    }
}

module.exports = Post