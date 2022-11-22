const { UserModel, ComapnyModel } = require("../../models");

const fillUsersWithCompany = async (companies, users) => {
  try {
    if (!companies) return null;
    if (!users) return null;

    users.forEach((user) => {
      let company = companies.find((x) => x._id.toString() === user.company_id);
      if (company) {
        user._doc.admin_email = company.admin_email;
        user._doc.admin_name = company.admin_name;
        user._doc.company_name = company.company_name;
        user._doc.company_url = company.company_url;
        user._doc.id = user._id;
      }
    });

    return users;
  } catch (e) {
    throw e;
  }
};

const fillUserCompany = async (user) => {
  try {
    const company = await ComapnyModel.findById(user.company_id);
    if (!company) return user;
    if (!user) return user;

    if (company) {
      user.admin_email = company.admin_email;
      user.admin_name = company.admin_name;
      user.company_name = company.company_name;
      user.company_url = company.company_url;
    }
    return user;
  } catch (e) {
    return user;
  }
};

exports.getUsersWithCompany = async () => {
  const users = await UserModel.find();

  var companties = await ComapnyModel.find();

  var resp = await fillUsersWithCompany(companties, users);

  return resp;
};
exports.insertUser = async (data) => {
  try {
    let res = await UserModel.create(data);
    return res._doc;
  } catch (e) {
    throw e;
  }
};

exports.updateUser = async (data) => {
  try {
    let res = await UserModel.findByIdAndUpdate(data._id || data.id, data, {
      returnOriginal: false,
    });
    return res._doc;
  } catch (e) {
    throw e;
  }
};

exports.deleteUser = async (id) => {
  try {
    const res = await UserModel.findByIdAndDelete(id);
    if (!res) {
      throw new Error("NOT FOUND");
    }
    return res;
  } catch (e) {
    throw e;
  }
};

exports.updateUserPassword = async (id, password) => {
  try {
    let res = await UserModel.findByIdAndUpdate(
      id,
      { password },
      {
        returnOriginal: false,
      }
    );
    return res._doc;
  } catch (e) {
    throw e;
  }
};
exports.getUserByEmail = async (email) => {
  try {
    const user = await UserModel.findOne({
      email,
    });
    return user && user._doc;
  } catch (e) {
    throw e;
  }
};

exports.getUserByID = async (id) => {
  const user = await UserModel.findById(id);
  return user._doc;
};

exports.getUsers = async () => {
  const users = await UserModel.find();
  const res = users.map((u) => {
    return u._doc;
  });
  return res;
};

exports.login = async ({ email }) => {
  try {
    let user = await UserModel.findOne({
      email,
    });
    const id = user._id;

    user = await fillUserCompany(user && user._doc);
    user.id = id;

    return user;
  } catch (e) {
    throw e;
  }
};
