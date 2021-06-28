const {Model, DataTypes} = require('sequelize')
const bcrypt = require('bcryptjs')

class Usuario extends Model {
    static init(sequelize){
        super.init({
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            senha: DataTypes.STRING,
            islogged: DataTypes.BOOLEAN,
            status: DataTypes.BOOLEAN,
            isadm: DataTypes.BOOLEAN,
            avscad: DataTypes.INTEGER
        },
        {
            sequelize,
            hooks: {
                beforeCreate: (usuario) => {
                    const salt = bcrypt.genSaltSync()
                    usuario.senha = bcrypt.hashSync(usuario.senha, salt)
                }
            }
        })
    }

    static associate(models){
        this.hasMany(models.Prova, {foreignKey: 'user_id', as: 'avaliacao'})
    }
}

module.exports = Usuario