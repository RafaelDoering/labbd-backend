const jwt = require('jsonwebtoken');

const { pool } = require('../utils/db');

module.exports.login = async (req, res) => {
  const {
    userId,
    password,
  } = req.body;
  return res.status(200).json();

  const queryResponse = await pool.query(`
    SELECT funcionario.id_funcionario, funcionario.departamento, credencial.senha
    FROM public.funcionario as funcionario
    LEFT JOIN public.credencial as credencial
    ON funcionario.login=credencial.login
    WHERE id_funcionario=$1;
  `, [userId]);
  const user = queryResponse.rows[0];
  console.log(req.body);
  console.log(user);
  if (!user || user.senha !== password) {
    return res.status(401).json();
  }

  const token = jwt.sign({ data: { id: user.id } }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: '30d',
  });

  res.setHeader('Authorization', `Bearer ${token}`);

  return res.status(200).json({
    email: user.email,
    name: user.name,
    id: user._id,
  });
};

module.exports.getLoggedUser = async (req, res) => {
  return res.status(200).json({
    email: req.user.email,
    name: req.user.name,
    id: req.user._id,
  });
};

module.exports.authenthicate = async (req, res, next) => {
  let token = req.header('Authorization');
  if (!token) {
    return res.status(401).json();
  }
  token = token.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY).data;

  const queryResponse = await pool.query('SELECT * FROM users WHERE id=$1', [decoded.id]);
  const user = queryResponse.rows[0];
  if (!user) {
    return res.status(401).json();
  }

  req.user = user;

  next();
};
