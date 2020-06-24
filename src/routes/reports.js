const { Router } = require('express');

const PatientsController = require('../controllers/reports/patients');
const HospitalsController = require('../controllers/reports/hospitals');
const TreatmentsController = require('../controllers/reports/treatments');
const SamplesController = require('../controllers/reports/samples');
const LaboratoriesController = require('../controllers/reports/laboratories');
const ResearchersController = require('../controllers/reports/researchers');

const router = Router();

router.get('/pacientes', PatientsController.patients);
router.get('/hospitais', HospitalsController.hospitals);
router.get('/treatments', TreatmentsController.treatments);
router.get('/samples', SamplesController.samples);
router.get('/laboratories', LaboratoriesController.laboratories);
router.get('/pesquisadores', ResearchersController.researchers);

module.exports = router;
