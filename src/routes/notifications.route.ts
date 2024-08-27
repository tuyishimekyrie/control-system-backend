import express from 'express'
import {getAllNotificationsController} from '../controllers/notifications.controller'

const notificationsRoutes = express.Router();

notificationsRoutes.get("/notifications", getAllNotificationsController);


export default notificationsRoutes;
