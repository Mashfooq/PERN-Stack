import { Allow, BackendMethod, remult } from "remult"
import { Task } from "../shared/Task"

export class TasksController {
  @BackendMethod({ allowed: Allow.authenticated })
  static async setAllCompleted(completed: boolean) {
    const taskRepo = remult.repo(Task)

    for (const task of await taskRepo.find()) {
      await taskRepo.save({ ...task, completed })
    }
  }
}