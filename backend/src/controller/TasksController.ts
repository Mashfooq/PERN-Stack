import { BackendMethod, remult } from "remult"
import { Task } from "../shared/Task"

export class TasksController {
  @BackendMethod({ allowed: true })
  static async setAllCompleted(userId: number | undefined, completed: boolean) {
    const taskRepo = remult.repo(Task)

    for (const task of await taskRepo.find({where: { userId: userId, isActive: true }})) {
      await taskRepo.save({ ...task, completed })
    }
  }

  static async clearAllCompleted(userId: number | undefined, isActive: boolean) {
    const taskRepo = remult.repo(Task)

    for (const task of await taskRepo.find({where: { userId: userId, completed: true, isActive: !isActive }})) {
      await taskRepo.save({ ...task, isActive })
    }
  }
}