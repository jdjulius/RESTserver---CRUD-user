const {response, request} = require('express');
const Usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');

const validarJWT = async (req = request, res = response, next) => {
    
    const {xtoken} = req.query;
    
    if(!xtoken) {
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        });
    }

    try {

        const { uid }= jwt.verify(xtoken, process.env.SECRETOPRIVATEKEY);

        // leer el usuario que corresponde al uid
        const usr = await Usuario.findById(uid);

        if (!usr) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en DB'
            });
        }

        //verifivcar si el uid tiene estado true
        if (!usr.estado) {
            return res.status(401).json({
                msg: 'Token no valido -  usuario con estado: false'
            });
        }



        req.uid = uid;
        req.usuarioAutenticado = usr;
        //console.log(payload);

        next();
        
    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'ERROR: Token no valido'
        });

    }

    // console.log(xtoken);

    // next();

}



module.exports = {
    validarJWT
};
