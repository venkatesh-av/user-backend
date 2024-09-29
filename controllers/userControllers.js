const { getDatabase } = require('../database');

const registerUser = async (req, res, next) => {
  const { name, addresses } = req.body;
  const db = getDatabase();

  try {
    await db.run('BEGIN TRANSACTION');

    const insertUserQuery = `INSERT INTO User (name) VALUES (?)`;
    const userResult = await db.run(insertUserQuery, [name]);
    const userId = userResult.lastID;

    const insertAddressQuery = `INSERT INTO Address (user_id, address) VALUES (?, ?)`;
    for (let address of addresses) {
      await db.run(insertAddressQuery, [userId, address]);
    }

    await db.run('COMMIT');

    res.status(201).json({ message: "User registered successfully with addresses", userId });
  } catch (error) {
    await db.run('ROLLBACK');
    next(error);
  }
};

const getUserAddresses = async (req, res, next) => {
  const { userId } = req.params;
  const db = getDatabase();

  try {
    const query = `
      SELECT address
      FROM Address
      WHERE user_id = ?
    `;
    const addresses = await db.all(query, [userId]);
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();

  try {
    const countQuery = 'SELECT COUNT(*) as total FROM User';
    const usersQuery = `
      SELECT User.id, User.name, GROUP_CONCAT(Address.address, '|') as addresses
      FROM User
      LEFT JOIN Address ON User.id = Address.user_id
      GROUP BY User.id
      LIMIT ? OFFSET ?
    `;

    const [{ total }] = await db.all(countQuery);
    const users = await db.all(usersQuery, [limit, offset]);

    const formattedUsers = users.map(user => ({
      ...user,
      addresses: user.addresses ? user.addresses.split('|') : []
    }));

    res.json({
      users: formattedUsers,
      totalUsers: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};


const updateUserName = async (req, res, next) => {
  const { userId } = req.params;
  const { name } = req.body;
  const db = getDatabase();

  try {
    const updateQuery = `
      UPDATE User
      SET name = ?
      WHERE id = ?
    `;
    const result = await db.run(updateQuery, [name, userId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User name updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  const db = getDatabase();

  try {
    await db.run('BEGIN TRANSACTION');

    
    await db.run('DELETE FROM Address WHERE user_id = ?', [userId]);

    
    const result = await db.run('DELETE FROM User WHERE id = ?', [userId]);

    if (result.changes === 0) {
      await db.run('ROLLBACK');
      return res.status(404).json({ error: "User not found" });
    }

    await db.run('COMMIT');
    res.json({ message: "User and associated addresses deleted successfully" });
  } catch (error) {
    await db.run('ROLLBACK');
    next(error);
  }
};


module.exports = {
  registerUser,
  getUserAddresses,
  getUsers,
  updateUserName,
  deleteUser,
 
};