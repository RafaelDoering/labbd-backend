const { pool } = require('../../utils/db');

module.exports.researchers = async (req, res) => {
  const {
    limit,
    offset,
  } = req.query;

  const queryResponse = await pool.query(`
    select pessoa.nome, funcionario.registro_institucional, funcionario.data_contratacao, id_amostra, amostra.data, resultado
    from pesquisador
    inner join funcionario
    on id_pesquisador = id_funcionario
    inner join amostra
    on pesquisador.id_pesquisador = amostra.id_pesquisador,
    pessoa
    where(pessoa.id_pessoa = pesquisador.id_pesquisador)
    group by (pessoa.nome, registro_institucional, data_contratacao, id_amostra, amostra.data, resultado)
    LIMIT $1
    OFFSET $2;
  `, [limit, offset]);
  const researchers = queryResponse.rows;

  const queryTotalResponse = await pool.query(`
    SELECT count(*)
    from pesquisador
    inner join funcionario
    on id_pesquisador = id_funcionario
    inner join amostra
    on pesquisador.id_pesquisador = amostra.id_pesquisador,
    pessoa
    where(pessoa.id_pessoa = pesquisador.id_pesquisador)
    group by (pessoa.nome, registro_institucional, data_contratacao, id_amostra, amostra.data, resultado);
  `);

  return res.status(200).json({
    data: researchers,
    total: parseInt(queryTotalResponse.rows[0].count, 10),
  });
};
