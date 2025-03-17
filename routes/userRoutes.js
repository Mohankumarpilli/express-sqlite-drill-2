const express = require('express');
const { createuser, deleteuser, addtasktouser, getallUsers, getbyid, patchisfavi} = require('../controllers/usercontroller');

const routes = express.Router();

routes.post('/user',createuser);

routes.delete('/user/:id',deleteuser);

routes.post('/user-task',addtasktouser);

routes.patch('/update-is-fav/:id',patchisfavi);

routes.get('/get-all-user',getallUsers);
routes.get('/get-by/user_id/:id',getbyid);
routes.get('/get-by/project_id/:id',getbyid);
routes.get('/get-by/due_date/:id',getbyid);
routes.get('/get-by/is_completed/:id',getbyid);
routes.get('/get-by/created_at/:id',getbyid);

module.exports = routes;