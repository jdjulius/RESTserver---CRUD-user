const {response, request} = require('express');


const esAdminRole = (req = request, res = response, next) => {
    
    if(!req.usuarioAutenticado){
        return res.status(500).json({
            msg: 'se quiere verificar el role sin validar el token primero'
        });
    }

    const {rol, nombre} = req.usuarioAutenticado;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador, no puede hacer esto`
        });
    }

    next();
}


const tieneRol = (...roles) => {
    
    return (req, res = response, next) => {
        //console.log(roles, req.usuarioAutenticado.rol);

        if(!req.usuarioAutenticado){
            return res.status(500).json({
                msg: 'se quiere verificar el role sin validar el token primero'
            });
        }
    
        if (!roles.includes(req.usuarioAutenticado.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }
    
        next();
    }

}


module.exports = {
    esAdminRole,
    tieneRol
};
