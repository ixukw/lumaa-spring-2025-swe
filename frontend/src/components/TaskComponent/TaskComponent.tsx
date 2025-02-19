import { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/authContext';
import './TaskComponent.css';

type Task = {
  id: number,
  title: string,
  description: string,
  iscomplete: boolean
}
export default function TaskComponent() {
  const authContext = useAuthContext();
  const [tasks, setTasks] = useState<Array<Task>>([]);

  const reqHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'authorization': authContext.user
  }

  /**
   * Gets all tasks
   */
  async function getTasks(): Promise<void> {
    try {
      const result = await fetch('http://localhost:3001/tasks/', {
        method: 'GET',
        headers: reqHeaders
      });
      if (!result.ok) {
        console.error('\ninternal error calling getTask endpoint');
        return;
      }
      const data = await result.json();
      setTasks(data);
    } catch (error) {
      console.error('\nError in getTasks in TaskComponent');
    }
  }

  /**
   * Deletes a task
   * @param id task id to delete
   */
  async function deleteTask(id: number): Promise<void> {
    try {
      const result = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'DELETE',
        headers: reqHeaders
      });

      if (!result.ok) {
        console.error('\ninternal error calling deleteTask endpoint');
        return;
      }
      getTasks();
    } catch (error) {
      console.error('\nError in deleteTask in TaskComponent');
    }
  }

  /**
   * Updates a task
   * @param id task id to update
   * @param e React event
   */
  async function handleUpdateTaskSubmit(id: number, e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();

    const form = e.target as typeof e.target & {
      title: { value: string };
      description: { value: string };
      iscomplete: { checked: boolean };
    };

    const thisTask = tasks.find(x => x.id === id);
    const title = form.title.value ? form.title.value : thisTask?.title;
    const description = form.description.value ? form.description.value : thisTask?.description;
    const iscomplete = form.iscomplete.checked;

    try {
      const result = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PUT',
        headers: reqHeaders,
        body: JSON.stringify({
          title: title,
          description: description,
          iscomplete: iscomplete
        })
      });

      if (!result.ok) {
        console.error('\ninternal error calling updateTask endpoint');
        return;
      }
      getTasks();
    } catch (error) {
      console.error('\nError in updateTask in Task Component');
    }
  }

  /**
   * Creates a task
   * @param e React event
   */
  async function handleCreateTaskSubmit(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();

    const form = e.target as typeof e.target & {
      title: { value: string };
      description: { value: string };
      iscomplete: { checked: boolean };
    };

    const title = form.title.value;
    const description = form.description.value;
    const iscomplete = form.iscomplete.checked;

    try {
      const result = await fetch('http://localhost:3001/tasks/', {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify({
          title: title,
          description: description,
          iscomplete: iscomplete
        })
      });
      if (!result.ok) {
        console.error('\nInternal error calling createTask endpoint');
        return;
      }
      getTasks();
    } catch (error) {
      console.error('\nError in createTask in TaskComponent');
    }
  }

  useEffect(() => {
    if (authContext.user) {
      getTasks();
    }
  // eslint-disable-next-line
  }, [authContext]);

  return (
    <div className="task-component">
      {authContext.user ?
      <div>
        <h1>Tasks</h1>
        <div>
          {tasks.length > 0 ? tasks.map(task => {
            return (
              <div className="task-item" key={task.id} id={task.id.toString()}>
                <div>
                  <h2>{task.title}</h2>
                  <span>{task.description}</span>
                  <span>Completed: <input type="checkbox" name="iscomplete" checked={task.iscomplete ? task.iscomplete : false} readOnly/></span>
                </div>
                <div>
                  <form onSubmit={(e) => {handleUpdateTaskSubmit(task.id, e)}}>
                    <input type="text" name="title" placeholder="update task title"/>
                    <input type="text" name="description" placeholder="update task description"/>
                    <span>isComplete: <input type="checkbox" name="iscomplete" defaultChecked={task.iscomplete}/></span>
                    <button type="submit">Update</button>
                  </form>
                  <button onClick={() => deleteTask(task.id)}>Delete Task</button>
                </div>
              </div>
            )})
          : <p>No tasks found.</p>}
        </div>

        <div className="task-create-container">
          Create New Task
          <form method="POST" onSubmit={handleCreateTaskSubmit}>
            <input type="text" name="title" placeholder="title" required></input>
            <input type="text" name="description" placeholder="description"></input>
            <span>isComplete: <input type="checkbox" name="iscomplete"></input></span>
            <button type="submit">Create Task</button>
          </form>
        </div>

      </div>
      : <p>Please login to view this resource.</p>}
    </div>
  )
}