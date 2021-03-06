const { Router } = require('express');
const { check } = require('express-validator');
const { esRoleValido,
    emailExiste,
    existeUsuarioPorId
} = require('../helpers/db-validators');

const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch } = require('../controllers/usuarios');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRol } = require('../middlewares/validar-roles');
const { 
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRol } = require('../middlewares');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', "El nombre es obligatorio").not().isEmpty(),
    check('correo', "El correo no es valido").isEmail(),
    check('password', "El password debe de ser mas de 6 letras").isLength({ min: 6 }),
    check('correo').custom(emailExiste),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);





module.exports = router;