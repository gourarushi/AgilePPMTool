import { Component } from "react";
import ProjectTask from "./ProjectTask/ProjectTask";

class Backlog extends Component {
  render() {
    const { project_tasks_prop } = this.props;

    const tasksByStatus = (status) =>
      project_tasks_prop
        .filter((projectTask) => projectTask.status === status)
        .map((project_task) => (
          <ProjectTask key={project_task.id} project_task={project_task} />
        ));

    const todoItems = tasksByStatus("TO_DO");
    const inProgressItems = tasksByStatus("IN_PROGRESS");
    const doneItems = tasksByStatus("DONE");

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="card text-center mb-2">
              <div className="card-header bg-secondary text-white">
                <h3>TO DO</h3>
              </div>
            </div>
            {todoItems}
          </div>
          <div className="col-md-4">
            <div className="card text-center mb-2">
              <div className="card-header bg-primary text-white">
                <h3>In Progress</h3>
              </div>
            </div>
            {inProgressItems}
          </div>
          <div className="col-md-4">
            <div className="card text-center mb-2">
              <div className="card-header bg-success text-white">
                <h3>Done</h3>
              </div>
            </div>
            {doneItems}
          </div>
        </div>
      </div>
    );
  }
}

export default Backlog;
