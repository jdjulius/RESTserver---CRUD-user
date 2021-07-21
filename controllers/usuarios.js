const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet =async  (req = request, res = response) => {

    const { limite = 5, desde = 0} = req.query;
    const querry = {estado:true};

    // const usuarios = await Usuario.find(querry)
    // .skip(Number(desde))
    // .limit(Number(limite));

    // const total = await Usuario.countDocuments(querry);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(querry),
        Usuario.find(querry)
                .skip(Number(desde))
                .limit(Number(limite))
    ]);

    res.json({
        msg: 'get API - controlador',
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol});

    // verificar si correoe existe
    

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar
    await usuario.save();

    res.json({
        msg: 'post API - usuariosPost',
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto} = req.body;

    //TODO validar contra base de datos
    if (password){
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync ( password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto);

    res.json({
        msg: 'put API - usuariosPut',
        usuario
    });
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    //const usuario= await Usuario.findByIdAndDelete(id);

    const usuario= await Usuario.findByIdAndUpdate(id, {estado:false});


    res.json({
        msg: 'delete API - usuariosDelete',
        usuario
    });
}

const usuariosPatch = async (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}