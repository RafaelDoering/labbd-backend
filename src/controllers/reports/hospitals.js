const { pool } = require('../../utils/db');

module.exports.hospitals = async (req, res) => {
  const {
    limit,
    offset,
  } = req.query;

  const queryResponse = await pool.query(`
    select hospital.nome, concat(hospital.cidade,',',hospital.estado, hospital.pais), qtd_funcionario, qtd_leitos,
    count(atendimento.id_atendimento) as qtd_atendimentos , count(distinct paciente.id_paciente) as qtd_pacientes
    from atendimento
    inner join paciente
    on atendimento.id_paciente = paciente.id_paciente
    inner join hospital
    on paciente.id_hospital = hospital.id_hospital
    group by(hospital.nome, concat(hospital.cidade,',',hospital.estado, hospital.pais), qtd_funcionario, qtd_leitos)
    LIMIT $1
    OFFSET $2;
  `, [limit, offset]);
  const hospitals = queryResponse.rows;

  const queryTotalResponse = await pool.query(`
    SELECT count(*)
    from atendimento
    inner join paciente
    on atendimento.id_paciente = paciente.id_paciente
    inner join hospital
    on paciente.id_hospital = hospital.id_hospital
    group by(hospital.nome, concat(hospital.cidade,',',hospital.estado, hospital.pais), qtd_funcionario, qtd_leitos);
  `);

  return res.status(200).json({
    data: hospitals,
    total: parseInt(queryTotalResponse.rows[0].count, 10),
  });
};
