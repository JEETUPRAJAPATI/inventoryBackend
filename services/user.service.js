const User = require('../models/User');
const logger = require('../utils/logger');
const { REGISTRATION_TYPES, OPERATOR_TYPES, BAG_TYPES } = require('../config/constants');
class UserService {
  async getUsers({ search, status }) {
    try {
      const query = {};

      // If status is not 'all', filter by status
      if (status && status !== 'all') {
        query.status = status;
      }

      // Add a search filter if search term is provided
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },  // Case-insensitive search for name
          { email: { $regex: search, $options: 'i' } },  // Case-insensitive search for email
        ];
      }

      // Fetch users based on the filters
      const users = await User.find(query)
        .select('-password');  // Exclude the password field from the result

      return users;  // Return the filtered list of users
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }


  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user.toJSON();
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }
  async updateUser(userId, userData) {
    console.log('userId', userId);
    console.log('userData', userData);
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: userData }
      ).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    }
  }



  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { status: 'inactive' },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  }
}

module.exports = new UserService();