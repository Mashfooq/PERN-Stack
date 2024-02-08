// src/App.tsx

import { useEffect, useState, FormEvent } from "react";
import { remult } from "remult";
import { Task } from "../../backend/src/shared/Task";

// Import components
import InputSkeleton from "./components/InputSkeleton";

const taskRepo = remult.repo(Task);

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const addTask = async (e: FormEvent) => {
    e.preventDefault()
    try {
      // we should remove the manual adding of new Tasks to the component's state:
      // const newTask = await taskRepo.insert({ title: newTaskTitle })
      // setTasks([...tasks, newTask])

      // This will add tasks immidiately to the component 
      await taskRepo.insert({ title: newTaskTitle })
      setNewTaskTitle("")
    } catch (error) {
      alert((error as { message: string }).message)
    }
  }

  // This below method doesn't load content in realtime, as in multiplayer is not active
  // useEffect(() => {
  //   taskRepo.find({
  //     limit: 20,
  //     orderBy: { createdAt: "asc" }
  //   })
  //     .then(setTasks);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 500);
  // }, []);

  useEffect(() => {
    return taskRepo
      .liveQuery({
        limit: 20,
        orderBy: { id: "desc" }
        // where: { completed: true },
      })
      .subscribe(info => {
        setTasks(info.applyChanges);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });

  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div>
        <h1 className="text-4xl font-bold mb-4">TODO</h1>
      </div>

      <div className="w-full max-w-md">
        <form onSubmit={addTask} className="mb-4">
          <label htmlFor="chat" className="sr-only">
            What needs to be done?
          </label>
          <div className="flex items-center  ml-4">
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              type="text"
              id="chat"
              className="block flex-grow p-2.5 text-sm text-gray-900 bg-white rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What needs to be done?"
              required
            />
            <button
              type="submit"
              className="p-2 text-blue-600 rounded-r-lg cursor-pointer hover:bg-blue-100"
            >
              <svg
                className="w-5 h-5 rotate-90 rtl:-rotate-90"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 20"
              >
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
              </svg>
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>

        {loading ? (
          <InputSkeleton length={6} />
        ) : (
          <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg ml-4 mb-4 mr-4">
            {tasks.map(task => {

              const setTask = (value: Task) =>
                setTasks(tasks => tasks.map(t => (t === task ? value : t)))

              const setCompleted = async (completed: boolean) =>
                // Optionally remove other redundant state changing code:
                // setTask(await taskRepo.save({ ...task, completed }))
                await taskRepo.save({ ...task, completed })

              // Update title
              const setTitle = (title: string) => setTask({ ...task, title })

              const saveTask = async () => {
                try {
                  // Optionally remove other redundant state changing code:
                  // setTask(await taskRepo.save(task))
                  await taskRepo.save(task)
                } catch (error) {
                  alert((error as { message: string }).message)
                }
              }

              const deleteTask = async () => {
                try {
                  await taskRepo.delete(task)
                  // Optionally remove other redundant state changing code:
                  // setTasks(tasks.filter(t => t !== task))
                } catch (error) {
                  alert((error as { message: string }).message)
                }
              }

              return (
                <li key={task.id} className="border-b border-gray-200 rounded-t-lg">
                  <div className="flex items-center py-2 ps-3">
                    <input
                      id={`vue-checkbox-${task.id}`}
                      type="checkbox"
                      value=""
                      checked={task.completed}
                      onChange={e => setCompleted(e.target.checked)}
                      className="w-8 h-8 text-blue-600 bg-gray-100 rounded"
                    />
                    {/* <label
                      htmlFor={`vue-checkbox-${task.id}`}
                      {task.title}
                    </label> */}
                    <input
                      value={task.title}
                      // htmlFor={`vue-checkbox-${task.id}`}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full p-2 ms-2 text-sm font-medium text-gray-900"
                    />
                    <button
                      className="p-2 text-blue-600 cursor-pointer hover:bg-blue-100"
                      onClick={saveTask}>
                      <svg className="w-6 h-6 text-blue-800" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
                          d="M10 3v4c0 .6-.4 1-1 1H5m14-4v16c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V8c0-.4.1-.6.3-.8l4-4 .6-.2H18c.6 0 1 .4 1 1Z" />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-red-600 cursor-pointer hover:bg-red-100"
                      onClick={deleteTask}>
                      <svg className="w-6 h-6 text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm7.7-3.7a1 1 0 0 0-1.4 1.4l2.3 2.3-2.3 2.3a1 1 0 1 0 1.4 1.4l2.3-2.3 2.3 2.3a1 1 0 0 0 1.4-1.4L13.4 12l2.3-2.3a1 1 0 0 0-1.4-1.4L12 10.6 9.7 8.3Z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div>
        <p className="mt-2 mb-6 text-md font-medium text-gray-900">
          Powered by <span>React + Vite + Remult + Docker</span>
        </p>
      </div>
    </div>
  );
}
