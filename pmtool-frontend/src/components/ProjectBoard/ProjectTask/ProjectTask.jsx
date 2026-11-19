import PropTypes from "prop-types";
import { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProjectTask } from "../../../actions/backlogActions";

class ProjectTask extends Component {
  onDeleteClick = (backlog_id, pt_id) => {
    this.props.deleteProjectTask(backlog_id, pt_id);
  };

  render() {
    const { project_task } = this.props;
    let priorityString;
    let priorityClass;

    switch (project_task.priority) {
      case "LOW":
        priorityString = "LOW";
        priorityClass = "bg-info text-light";
        break;
      case "MEDIUM":
        priorityString = "MEDIUM";
        priorityClass = "bg-warning text-light";
        break;
      case "HIGH":
        priorityString = "HIGH";
        priorityClass = "bg-danger text-light";
        break;
      default:
        priorityString = "UNKNOWN";
        priorityClass = "badge badge-secondary";
    }

    return (
      <div className="card mb-1 bg-light">
        <div className={`card-header text-primary ${priorityClass}`}>
          ID: {project_task.projectSequence} -- Priority: {priorityString}
        </div>
        <div className="card-body bg-light">
          <h5 className="card-title">{project_task.summary}</h5>
          <p className="card-text text-truncate ">
            {project_task.acceptanceCriteria}
          </p>
          <Link
            to={`/updateProjectTask/${project_task.projectIdentifier}/${project_task.projectSequence}`}
            className="btn btn-primary"
          >
            View / Update
          </Link>

          <button
            className="btn btn-danger ml-4"
            onClick={() =>
              this.onDeleteClick(
                project_task.projectIdentifier,
                project_task.projectSequence,
              )
            }
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

ProjectTask.propTypes = {
  deleteProjectTask: PropTypes.func.isRequired,
};

export default connect(null, { deleteProjectTask })(ProjectTask);
