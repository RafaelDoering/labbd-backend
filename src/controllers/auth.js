const jwt = require('jsonwebtoken');

const { pool } = require('../utils/db');

module.exports.login = async (req, res) => {
  let {
    userId,
  } = req.body;
  const {
    password,
  } = req.body;

  if (userId === 'adminCovid') {
    userId = 9999999;
  }

  const query = `
    SELECT funcionario.id_funcionario as id, funcionario.departamento as departamento, credencial.senha as senha, password_hash('${password}') as password_attempt
    FROM public.funcionario as funcionario
    LEFT JOIN public.credencial as credencial
    ON funcionario.login=credencial.login
    WHERE funcionario.id_funcionario=${userId};
  `;
  const queryResponse = await pool.query(query);
  // eslint-disable-next-line prefer-destructuring
  const user = queryResponse.rows[0];
  if (!user || user.password_attempt !== user.senha) {
    return res.status(401).json();
  }

  const queryLog = 'INSERT INTO logs(id_func, reg_hora) VALUES ($1, $2)';
  await pool.query(queryLog, [user.id, new Date()]);

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
