const User = require('../models/User');
const logger = require('../utils/logger');

class UserService {
  async getUsers({ role, status, page = 1, limit = 10 }) {
    try {
      const query = {};
      if (role) query.registrationType = role;
      if (status) query.status = status;

      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .skip(skip)
          .limit(limit),
        User.countDocuments(query)
      ]);

      return {
        data: users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      };
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
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: userData },
        { new: true, runValidators: true }
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