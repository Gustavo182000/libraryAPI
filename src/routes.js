const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SessionController = require('./controllers/SessionController')
const BookController = require('./controllers/BookController')

  router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE ");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,x-access-token");
    next();
  });
function verifyJWT(req,res,next){
    const token = req.headers['x-access-token'];

    if(!token){return res.status(401).json({error: "token-expected"})}

    jwt.verify(token,process.env.SECRET,(err,decoded)=>{
        if(err){return res.status(500).json({error: "failed-auth-token"})}
        next();
    })
}

router.post('/register',SessionController.register);
router.post('/login',SessionController.login);
router.post('/logout',SessionController.logout);
router.post('/verifyjwt',SessionController.verifyJWT);
router.get('/books',verifyJWT,BookController.books);
router.post('/book',verifyJWT,BookController.registerBook);
router.delete('/book',verifyJWT,BookController.deleteBook);
router.put('/book',verifyJWT,BookController.updateBook);

module.exports = router;