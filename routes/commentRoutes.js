const express = require('express');
const {createcomment, deletecomment, getallcomments, getbytaskid, getbyprojectid} = require('../controllers/commentscontroller');

const routes = express.Router();

routes.get('/comments',getallcomments);
routes.get('/comment/get-by-task-id/:id',getbytaskid);
routes.get('/comment/get-by-project-id/:id',getbyprojectid);

routes.post('/comment',createcomment);

routes.delete('/comment/comment-id/:id',deletecomment);
routes.delete('/comment/task-id/:id',deletecomment);
routes.delete('/comment/project-id/:id',deletecomment);

module.exports = routes;