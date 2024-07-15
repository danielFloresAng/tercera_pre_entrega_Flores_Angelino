import usersModel from "../models/users.models.js";

class UserService {
  constructor() {
    this.model = usersModel;
  }

  get = async () => {
    try {
      return await this.model.find().lean();
    } catch (error) {
      return error.message;
    }
  };
  getById = async (email) => {
    try {
      return await this.users.findById(email).lean();
    } catch (error) {
      return error.message;
    }
  };

  add = async (firstName, lastName, email, password) => {
    try {
      return await this.model.create({
        firstName,
        lastName,
        email,
        password,
      });
    } catch (error) {
      return error.message;
    }
  };

  delete = async (firstName, lastName, email, password) => {
    try {
      return this.model.deleteOne(firstName, lastName, email, password);
    } catch (error) {
      return error.message;
    }
  };
}

export default UserService;
