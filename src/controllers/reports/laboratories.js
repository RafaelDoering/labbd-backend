const { pool } = require('../../utils/db');

module.exports.laboratories = async (req, res) => {
  const {
    limit,
    offset,
  } = req.query;

  const filter = JSON.parse(req.query.filter).q;

  let query = `
    select
      row_number() over () as id, l.nome as nome_do_laboratorio, l.qtd_pesquisadores as quantidade_de_pesquisadores, concat(l.cidade,',',l.estado,',',l.pais) as endereco_completo,
      count(a.resultado) as quantidade_de_amostras_recebidas
    from laboratorio l
    inner join amostra a
    on a.id_laboratorio = l.id_laboratorio
  `;
  if (filter) {
    query += `where lower(l.nome) like lower('%${filter}%') `;
  }
  query += 'group by l.nome, quantidade_de_pesquisadores, endereco_completo ';
  if (limit) {
    query += `LIMIT ${limit} `;
  }
  if (offset) {
    query += `OFFSET ${offset} `;
  }
  query += ';';

  const queryResponse = await pool.query(query);
  const laboratories = queryResponse.rows;

  let queryTotal = `
    select count(*) from
    (select
      l.nome as nome_do_laboratorio, l.qtd_pesquisadores as quantidade_de_pesquisadores, concat(l.cidade,',',l.estado,',',l.pais) as endereco_completo,
      count(a.resultado ) as quantidade_de_amostras_recebidas
    from laboratorio l
    inner join amostra a
    on a.id_laboratorio = l.id_laboratorio
  `;
  if (filter) {
    queryTotal += `where lower(l.nome) like lower('%${filter}%') `;
  }
  queryTotal += 'group by l.nome, quantidade_de_pesquisadores, endereco_completo ';
  queryTotal += ') as tb1;';

  const queryTotalResponse = await pool.query(queryTotal);

  return res.status(200).json({
    data: laboratories,
    total: parseInt(queryTotalResponse.rows[0].count, 10),
  });
};
