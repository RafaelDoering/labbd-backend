const { pool } = require('../../utils/db');

module.exports.researchers = async (req, res) => {
  const {
    limit,
    offset,
  } = req.query;

  const filter = JSON.parse(req.query.filter).q;

  let query = `
    select
      row_number() over () as id, pessoa.nome as nome_do_pesquisador, funcionario.registro_institucional as registro_institucional, funcionario.data_contratacao as data_de_contratacao,
      id_amostra as identificador_da_amostra, amostra.data as data_da_amostra, resultado as resultado_da_amostra
    from pesquisador
    inner join funcionario
    on id_pesquisador = id_funcionario
    inner join amostra
    on pesquisador.id_pesquisador = amostra.id_pesquisador,
    pessoa
    where pessoa.id_pessoa = pesquisador.id_pesquisador
  `;
  if (filter) {
    query += `and lower(pessoa.nome) like lower('%${filter}%') `;
  }
  query += 'group by (pessoa.nome, registro_institucional, data_contratacao, id_amostra, amostra.data, resultado) ';
  if (limit) {
    query += `LIMIT ${limit} `;
  }
  if (offset) {
    query += `OFFSET ${offset} `;
  }
  query += ';';

  const queryResponse = await pool.query(query);
  const researchers = queryResponse.rows;

  let queryTotal = `
    select count(*) from
    (select
      pessoa.nome as nome_do_pesquisador, funcionario.registro_institucional as registro_institucional, funcionario.data_contratacao as data_de_contratacao,
      id_amostra as identificador_da_amostra, amostra.data as data_da_amostra, resultado as resultado_da_amostra
    from pesquisador
    inner join funcionario
    on id_pesquisador = id_funcionario
    inner join amostra
    on pesquisador.id_pesquisador = amostra.id_pesquisador,
    pessoa
    where pessoa.id_pessoa = pesquisador.id_pesquisador
  `;
  if (filter) {
    queryTotal += `and lower(pessoa.nome) like lower('%${filter}%') `;
  }
  queryTotal += 'group by (pessoa.nome, registro_institucional, data_contratacao, id_amostra, amostra.data, resultado) ';
  queryTotal += ') as tb1;';

  const queryTotalResponse = await pool.query(queryTotal);

  return res.status(200).json({
    data: researchers,
    total: parseInt(queryTotalResponse.rows[0].count, 10),
  });
};
