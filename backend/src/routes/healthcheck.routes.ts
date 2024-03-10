import { Router } from 'express';
import { healthcheck } from "../controller/HealthCheck.controller"

const router = Router();

router.route('/').get(healthcheck);

export default router