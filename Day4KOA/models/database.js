const Users = require('./user');

module.exports.getAll = () => Users.find();

module.exports.getById = (paramsId) => Users.findById({"_id": paramsId});

// module.exports.delUser = id => Users.findById({id}).remove();

module.exports.updateUser = (id,body) => Users.update({_id: id}, {$set:body});

module.exports.delUser = id => Users.findByIdAndRemove({ _id: id });
module.exports.getAll = () => Users.find();

module.exports.add = function (data) {
        let User = new Users({
        login: data.login,
        email: data.email,
        password: data.password
    });
  
    return User.save();
  };

  
