const { pool } = require('../../utils/db');

module.exports.hospitals = async (req, res) => {
  const {
    limit,
    offset,
  } = req.query;

  const filter = JSON.parse(req.query.filter).q;

  let query = `
    select
      row_number() over () as id, hospital.nome as nome_hospital, concat(hospital.cidade,',',hospital.estado, hospital.pais) AS endereco_completo,
      qtd_funcionario as quantidade_de_funcionarios, qtd_leitos as quantidade_de_leitos,
      count(atendimento.id_atendimento) as quantidade_de_atendimentos_registrados, count(distinct paciente.id_paciente) as quantidade_de_pacientes_distintos_atendidos
    from atendimento
    inner join paciente
    on atendimento.id_paciente = paciente.id_paciente
    inner join hospital
    on paciente.id_hospital = hospital.id_hospital
  `;
  if (filter) {
    query += `where lower(hospital.nome) like lower('%${filter}%') `;
  }
  query += 'group by(hospital.nome, concat(hospital.cidade,\',\',hospital.estado, hospital.pais), qtd_funcionario, qtd_leitos) ';
  if (limit) {
    query += `LIMIT ${limit} `;
  }
  if (offset) {
    query += `OFFSET ${offset} `;
  }
  query += ';';

  const queryResponse = await pool.query(query);
  const hospitals = queryResponse.rows;

  let queryTotal = `
    select count(*) from
    (select
      hospital.nome as nome_hospital, concat(hospital.cidade,',',hospital.estado, hospital.pais) AS endereco_completo,
      qtd_funcionario as quantidade_de_funcionarios, qtd_leitos as quantidade_de_leitos,
      count(atendimento.id_atendimento) as quantidade_de_atendimentos_registrados, count(distinct paciente.id_paciente) as quantidade_de_pacientes_distintos_atendidos
    from atendimento
    inner join paciente
    on atendimento.id_paciente = paciente.id_paciente
    inner join hospital
    on paciente.id_hospital = hospital.id_hospital
  `;
  if (filter) {
    queryTotal += `where lower(hospital.nome) like lower('%${filter}%') `;
  }
  queryTotal += 'group by(hospital.nome, concat(hospital.cidade,\',\',hospital.estado, hospital.pais), qtd_funcionario, qtd_leitos) ';
  queryTotal += ') as tb1;';

  const queryTotalResponse = await pool.query(queryTotal);

  return res.status(200).json({
    data: hospitals,
    total: parseInt(queryTotalResponse.rows[0].count, 10),
  });
};
