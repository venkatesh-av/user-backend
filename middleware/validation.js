const validateRegistration = (req, res, next) => {
  const { name, addresses } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: "Valid name is required" });
  }
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return res.status(400).json({ error: "At least one address is required" });
  }
  if (addresses.some(address => typeof address !== 'string' || address.trim() === '')) {
    return res.status(400).json({ error: "All addresses must be non-empty strings" });
  }
  next();
};

const validateUserId = (req, res, next) => {
  const { userId } = req.params;
  if (!userId || isNaN(parseInt(userId))) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  next();
};

const validatePagination = (req, res, next) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  if (page < 1) page = 1;
  if (limit < 1 || limit > 100) limit = 10;

  req.pagination = { page, limit };
  next();
};
const validateAddress = (req, res, next) => {
  const { address } = req.body;
  if (!address || typeof address !== 'string' || address.trim() === '') {
    return res.status(400).json({ error: "Valid address is required" });
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: "Valid name is required" });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateUserId,
  validatePagination,
  validateAddress,
  validateName
};