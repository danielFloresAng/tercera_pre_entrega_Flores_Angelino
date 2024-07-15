import UserService from "../services/users.dao.js";
import { createHash } from "../services/utils.js";

const service = new UserService();

class userDTO {
  constructor(data) {
    this.data = data;
    this.data.lastName = this.data.lastName.toUpperCase();
    this.data.password = createHash(this.data.password);
    this.data.orders = [];
  }
}

const normalize = new userDTO(data);

class UserManager {
  constructor() {
    this.users = usersModel;
  }

  getUser = async (filter) => {
    try {
      return await service.get();
    } catch (error) {
      return error.message;
    }
  };
  getUserById = async (id) => {
    try {
      return await this.users.findById(id).lean();
    } catch (error) {
      return error.message;
    }
  };

  addUser = async (firstName, lastName, email, password) => {
    try {
      return await service.add(normalize.data);
    } catch (error) {
      return error.message;
    }
  };

  deleteUser = async (data) => {
    try {
      return await service.delete(data);
    } catch (error) {
      return error.message;
    }
  };
}

export default UserManager;
