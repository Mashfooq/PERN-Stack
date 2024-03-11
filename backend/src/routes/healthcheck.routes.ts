import { Router } from 'express';
import { healthCheck } from "../controller/HealthCheck.controller"

const router = Router();

router.route('/').get(healthCheck);

export default router