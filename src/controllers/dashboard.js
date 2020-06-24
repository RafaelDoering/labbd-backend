const { pool } = require('../utils/db');

module.exports.dashboard = async (req, res) => {
  const PositiveCasesQueryResponse = await pool.query(`
    select count(id_atendimento) as count
    from atendimento
    where grau_avaliacao = 'I';
  `);
  const positiveCases = PositiveCasesQueryResponse.rows;

  const suspectCasesQueryResponse = await pool.query(`
    select count(id_atendimento)
    from atendimento
    where grau_avaliacao = 'A' or grau_avaliacao = 'M';
  `);
  const suspectCases = suspectCasesQueryResponse.rows;

  const hospitalsQueryResponse = await pool.query(`
    select hospital.nome, count(paciente.id_paciente )
    from atendimento
    inner join paciente
    on atendimento.id_paciente = paciente.id_paciente
    inner join hospital
    on hospital.id_hospital = paciente.id_hospital
    where EXTRACT(MONTH FROM atendimento."data")=4
    group by(hospital.nome)
    order by count(paciente.id_paciente ) desc
    fetch first 20 rows only;
  `);
  const hospitals = hospitalsQueryResponse.rows;

  const laboratoriesQueryResponse = await pool.query(`
    select laboratorio.nome, count(amostra.id_amostra )
    from laboratorio
    inner join amostra
    on laboratorio.id_laboratorio = amostra.id_laboratorio
    where EXTRACT(MONTH FROM amostra."data")=4
    group by(laboratorio.nome)
    order by count(amostra.id_amostra) desc
    fetch first 20 rows only;
  `);
  const laboratories = laboratoriesQueryResponse.rows;

  const citiesPositiveQueryResponse = await pool.query(`
    select distinct hospital.cidade, count(paciente.id_paciente )
    from atendimento
    inner join paciente
    on atendimento.id_paciente = paciente.id_paciente
    inner join hospital
    on hospital.id_hospital = paciente.id_hospital
    where EXTRACT(MONTH FROM atendimento."data")=4 and atendimento.grau_avaliacao = 'I'
    group by(hospital.cidade)
    order by count(paciente.id_paciente ) desc
    fetch first 20 rows only;
  `);
  const citiesPositive = citiesPositiveQueryResponse.rows;

  const citiesSuspectQueryResponse = await pool.query(`
    select distinct hospital.cidade, count(paciente.id_paciente )
    from atendimento
    inner join paciente
    on atendimento.id_paciente = paciente.id_paciente
    inner join hospital
    on hospital.id_hospital = paciente.id_hospital
    where EXTRACT(MONTH FROM atendimento."data")=4 and (grau_avaliacao = 'A' or grau_avaliacao = 'M')
    group by(hospital.cidade)
    order by count(paciente.id_paciente ) desc
    fetch first 20 rows only;
  `);
  const citiesSuspect = citiesSuspectQueryResponse.rows;

  return res.status(200).json({
    positiveCases: +positiveCases[0].count,
    suspectCases: +suspectCases[0].count,
    hospitals,
    laboratories,
    citiesPositive,
    citiesSuspect,
  });
};
