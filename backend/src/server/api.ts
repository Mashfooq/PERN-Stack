import { remultExpress } from "remult/remult-express"
import { Task } from "../shared/Task"
import { TasksController } from "../controller/TasksController"
import { AuthController } from "../controller/AuthController"
import { User } from "../shared/User"

export const api = remultExpress({
  entities: [Task, User],
  controllers: [TasksController, AuthController],
})