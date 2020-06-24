const { pool } = require('../../utils/db');

module.exports.samples = async (req, res) => {
  const {
    limit,
    offset,
  } = req.query;

  const query = `
    select
      row_number() over () as id, *
    from relatorio4(null, null, null)
    limit ${limit}
    offset ${offset};
  `;

  const queryResponse = await pool.query(query);
  const samples = queryResponse.rows;

  const queryTotal = `
    select count(*) from (select * from relatorio4(null, null, null)) as tb1;
  `;

  const queryTotalResponse = await pool.query(queryTotal);

  return res.status(200).json({
    data: samples,
    total: parseInt(queryTotalResponse.rows[0].count, 10),
  });
};
