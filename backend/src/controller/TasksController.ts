import { BackendMethod, remult } from "remult"
import { Task } from "../shared/Task"

export class TasksController {
  @BackendMethod({ allowed: true })
  static async setAllCompleted(completed: boolean) {
    const taskRepo = remult.repo(Task)

    for (const task of await taskRepo.find()) {
      await taskRepo.save({ ...task, completed })
    }
  }

  static async clearAllCompleted(isActive: boolean) {
    const taskRepo = remult.repo(Task)

    for (const task of await taskRepo.find({where: { completed:true }})) {
      await taskRepo.save({ ...task, isActive })
    }
  }
}