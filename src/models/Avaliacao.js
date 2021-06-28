const {Model, DataTypes} = require('sequelize')

class Prova extends Model{
    static init(sequelize){
        super.init({
            disciplina: DataTypes.STRING,
            materia: DataTypes.STRING,
            professor: DataTypes.STRING,
            data: DataTypes.DATE,
            nota: DataTypes.NUMBER,
            observacao: DataTypes.TEXT,
            iscompleted: DataTypes.BOOLEAN,
            status: DataTypes.BOOLEAN
        }, {
            sequelize
        })
    }

    static associate(models){
        this.belongsTo(models.Usuario, {foreignKey: 'user_id', as: 'user'})
    }
}

module.exports = Prova