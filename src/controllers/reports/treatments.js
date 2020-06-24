const { pool } = require('../../utils/db');

module.exports.treatments = async (req, res) => {
  const {
    limit,
    offset,
  } = req.query;

  const filter = JSON.parse(req.query.filter).q;

  const filtrarCidade = filter ? true : false;
  const varCidade = filter ? filter : null;

  const query = `
    select
      row_number() over () as id, *
    from relatorio3(${filtrarCidade}, '${varCidade}')
    order by(relatorio3."atendimentos") desc
    limit ${limit}
    offset ${offset};
  `;
  console.log(query);

  const queryResponse = await pool.query(query);
  const treatments = queryResponse.rows;
  console.log(treatments)

  return res.status(200).json({
    data: treatments,
    total: parseInt(queryResponse.rows[0].total_query, 10),
  });
};
