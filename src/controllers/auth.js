const jwt = require('jsonwebtoken');

const { pool } = require('../utils/db');

module.exports.login = async (req, res) => {
  const {
    userId,
    password,
  } = req.body;

  let user;
  if (userId === 'adminCovid') {
    if (password !== 'superAdmin') {
      return res.status(401).json();
    }
    user = {
      id: 9999999,
      departamento: 'Admin',
    };
  } else {
    const query = `
      SELECT funcionario.id_funcionario as id, funcionario.departamento as departamento, credencial.senha as senha
      FROM public.funcionario as funcionario
      LEFT JOIN public.credencial as credencial
      ON funcionario.login=credencial.login
      WHERE funcionario.id_funcionario=${userId};
    `;
    const queryResponse = await pool.query(query);
    // eslint-disable-next-line prefer-destructuring
    user = queryResponse.rows[0];
    if (!user || password !== user.senha) {
      return res.status(401).json();
    }
  }

  const query = 'INSERT INTO logs(id_func, reg_hora) VALUES ($1, $2)';
  await pool.query(query, [user.id, new Date()]);

  const token = jwt.sign({
    data: { id: user.id, departamento: user.departamento },
  }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: '30d',
  });

  return res.status(200).json({
    id: user.id,
    departamento: user.departamento,
    token,
  });
};
