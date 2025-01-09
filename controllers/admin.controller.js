const UserService = require('../services/user.service');
const logger = require('../utils/logger');

class AdminController {
  async getUsers(req, res) {
    try {
      const { role, status, page = 1, limit = 10 } = req.query;
      const users = await UserService.getUsers({ role, status, page, limit });
      
      res.json({
        success: true,
        data: users.data,
        pagination: users.pagination
      });
    } catch (error) {
      logger.error('Error fetching users:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      res.status(error.message === 'User not found' ? 404 : 500)
        .json({ 
          success: false, 
          message: error.message 
        });
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;
      if (req.file) {
        userData.profileImage = req.file.path;
      }
      
      const user = await UserService.createUser(userData);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      const user = await UserService.updateUser(id, userData);
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error updating user:', error);
      res.status(error.message === 'User not found' ? 404 : 400)
        .json({ 
          success: false, 
          message: error.message 
        });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      
      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      logger.error('Error deleting user:', error);
      res.status(error.message === 'User not found' ? 404 : 500)
        .json({ 
          success: false, 
          message: error.message 
        });
    }
  }
}

module.exports = new AdminController();