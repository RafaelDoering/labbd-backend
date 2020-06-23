const { pool } = require('../../utils/db');

module.exports.treatments = async (req, res) => {
  const {
    limit,
    offset,
  } = req.query;

  const queryResponse = await pool.query(`
    SELECT P.nome, P.idade, P.sexo, extract(year FROM age(P.data_nasc)) AS Data_de_Nascimento, concat(P.telefone_fixo,',',P.telefone_celular) AS Contato_telefonico, concat(P.cidade,',',P.estado,',',P.pais) AS Endereco, H.nome AS Hospital
    FROM Pessoa P, Amostra A, Hospital H
    WHERE P.id_pessoa = A.id_paciente AND A.resultado = 'P'
    LIMIT $1
    OFFSET $2;
  `, [limit, offset]);
  const patients = queryResponse.rows;

  const queryTotalResponse = await pool.query(`
    SELECT count(*)
    FROM Pessoa P, Amostra A, Hospital H
    WHERE P.id_pessoa = A.id_paciente AND A.resultado = 'P';
  `);

  return res.status(200).json({
    data: patients,
    total: parseInt(queryTotalResponse.rows[0].count, 10),
  });
};
