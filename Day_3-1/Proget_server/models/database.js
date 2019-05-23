const Users = require('./user');

module.exports.getAll = () => Users.find();

module.exports.getById = (paramsId) => Users.findById({"_id": paramsId});

module.exports.delUser = id => Users.findById({id})

module.exports.delUser = Id => Users.findByIdAndRemove({ _id: Id });
module.exports.getAll = () => Users.find();

module.exports.add = function (data) {
    let User = new Users({
        login: data.login,
        email: data.email,
        password: data.password
    });
  
    return User.save();
  };

  
