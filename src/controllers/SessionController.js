const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.register = async (req, res) => {

    const email = req.body.email;
    const senha = req.body.senha;
    const regMail = /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
    const regLetras = /([a-zA-Z])/;
    const regNumeros = /([0-9])/;
    const findMail = await User.find({ email: email })
    console.log(email,senha)
    if (!email || !senha) { return res.status(400).json({ error: "email-password-is-empty" }) }
    if (!regMail.test(email)) { return res.status(400).json({ error: "email-not-valid" }) }
    if (senha.length < 6) { return res.status(400).json({ error: "password-min-6" }) }
    if (!regLetras.test(senha)) { return res.status(400).json({ error: "password-include-letters" }) }
    if (!regNumeros.test(senha)) { return res.status(400).json({ error: "password-include-numbers" }) }
    if (findMail.length > 0) { return res.status(400).json({ error: "email-in-use" }) }

    const hash = bcrypt.hashSync(senha, 6);

    User.create({ email: email, senha: hash }).then(() => {
        return res.status(200).json({ success: "user-created" })
    }).catch((err) => {
        return res.status(400).json({ error: "fail-create-user" })
    })
}

exports.login = async (req, res) => {

    const email = req.body.email;
    const senha = req.body.senha;

    if (!email || !senha) { return res.status(400).json({ error: "email-password-is-empty" }) }

    const usuario = await User.findOne({ email: email })

    if (!usuario) { return res.status(400).json({ error: "email-not-exist" }) }

    const match = await bcrypt.compare(senha, usuario.senha)

    if (!match) { return res.status(400).json({ error: "email-password-not-match" }) } else {

        const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.SECRET, {
            expiresIn: 300
        })
        return res.status(200).json({ success: "login-success", token: token, auth: true })
    }


}

exports.logout = async (req, res) => {

    res.status(200).json({ success: "logout-success", token: null, auth: false });

}

exports.verifyJWT = async (req, res) => {

    const token = req.headers['x-access-token'];

    if(!token){return res.status(401).json({error: "token-expected"})}

    jwt.verify(token,process.env.SECRET,(err,decoded)=>{
        if(err){return res.status(500).json({error: "failed-auth-token"})}
        return res.status(200).json({success: "token-valid", auth: true,_id: decoded.id,email: decoded.email})
    })

}