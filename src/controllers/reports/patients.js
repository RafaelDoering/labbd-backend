const { pool } = require('../../utils/db');

module.exports.patients = async (req, res) => {
  const {
    limit,
    offset,
  } = req.query;

  const filter = JSON.parse(req.query.filter).q;

  let query = `
    SELECT
      row_number() over () as id, P.nome as nome, P.idade as idade, P.sexo as sexo, extract(year FROM age(P.data_nasc)) AS data_de_nascimento,
      concat(P.telefone_fixo,',',P.telefone_celular) AS contato_telefonico, concat(P.cidade,',',P.estado,',',P.pais) AS endereco_completo, H.nome AS hospital
    FROM Pessoa P, Amostra A, Hospital H
    WHERE P.id_pessoa = A.id_paciente AND A.resultado = 'P'
  `;
  if (filter) {
    query += `and lower(P.nome) like lower('%${filter}%') `;
  }
  if (limit) {
    query += `LIMIT ${limit} `;
  }
  if (offset) {
    query += `OFFSET ${offset} `;
  }
  query += ';';

  const queryResponse = await pool.query(query);
  const patients = queryResponse.rows;

  let queryTotal = `
    select count(*) from
    (SELECT
      P.nome as nome, P.idade as idade, P.sexo as sexo, extract(year FROM age(P.data_nasc)) AS data_de_nascimento,
      concat(P.telefone_fixo,',',P.telefone_celular) AS contato_telefonico, concat(P.cidade,',',P.estado,',',P.pais) AS endereco_completo, H.nome AS hospital
    FROM Pessoa P, Amostra A, Hospital H
    WHERE P.id_pessoa = A.id_paciente AND A.resultado = 'P'
  `;
  if (filter) {
    queryTotal += `where lower(P.nome) like lower('%${filter}%') `;
  }
  queryTotal += ') as tb1;';

  const queryTotalResponse = await pool.query(queryTotal);

  return res.status(200).json({
    data: patients,
    total: parseInt(queryTotalResponse.rows[0].count, 10),
  });
};
