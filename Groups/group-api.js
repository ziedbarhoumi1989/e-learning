const Group = require('../Groups/group-controller');
const Express = require('express');

let GroupAPI = Express.Router();

GroupAPI.post("/group/create/:module_code", (req, res) => {

    Group.createClassGroup(req.params.module_code, (error, group) => {

        if (error)
            res.json({status: false, error: error});
        else
            res.json(group);

    });

});


module.exports = GroupAPI