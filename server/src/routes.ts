import express from 'express'
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'
import multer from 'multer'
import multerConfiga from './config/multer'
import {celebrate,Joi} from 'celebrate'

const routes = express.Router()
const upload = multer(multerConfiga)
const pointsController =  new PointsController()
const itemsController = new ItemsController()

routes.get('/',(request,response)=>{
    return response.json( {message: "helo"});
});


routes.get('/items',itemsController.index);

routes.post('/points',
upload.single('image'),
celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longetude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
    })
},{ abortEarly:false }),
pointsController.create);

routes.get('/points/:id',pointsController.show);

routes.get('/points',  pointsController.index);

export default routes;
