import classnames from "classnames";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getProjectTask,
  updateProjectTask,
} from "../../../actions/backlogActions";

function UpdateProjectTask({
  getProjectTask,
  updateProjectTask,
  project_task,
  errors,
}) {
  const { backlog_id, id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: "",
    projectSequence: "",
    summary: "",
    acceptanceCriteria: "",
    status: "",
    priority: "",
    dueDate: "",
    projectIdentifier: "",
    create_At: "",
  });

  useEffect(() => {
    getProjectTask(backlog_id, id, navigate);
  }, [backlog_id, id, getProjectTask, navigate]);

  useEffect(() => {
    setForm({
      ...project_task,
      dueDate: project_task.dueDate?.slice(0, 10) || "",
    });
  }, [project_task]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    const UpdateProjectTaskPayload = {
      ...form,
      priority: form.priority || null,
    };

    updateProjectTask(backlog_id, id, UpdateProjectTaskPayload, navigate);
  };

  return (
    <div className="add-PBI">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <Link to={`/projectBoard/${backlog_id}`} className="btn btn-light">
              Back to Project Board
            </Link>
            <h4 className="display-4 text-center">Update Project Task</h4>
            <p className="lead text-center">
              Project Name: {form.projectIdentifier} + Project Task ID:{""}{" "}
              {form.projectSequence}
              {""}
            </p>
            {errors.message && (
              <div className="alert alert-danger" role="alert">
                {errors.message}
              </div>
            )}
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.summary,
                  })}
                  name="summary"
                  placeholder="Project Task summary"
                  value={form.summary || ""}
                  onChange={onChange}
                />
                {errors.summary && (
                  <div className="invalid-feedback">{errors.summary}</div>
                )}
              </div>
              <div className="form-group">
                <textarea
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.acceptanceCriteria,
                  })}
                  placeholder="Acceptance Criteria"
                  name="acceptanceCriteria"
                  value={form.acceptanceCriteria || ""}
                  onChange={onChange}
                />
                {errors.acceptanceCriteria && (
                  <div className="invalid-feedback">
                    {errors.acceptanceCriteria}
                  </div>
                )}
              </div>
              <h6>Due Date</h6>
              <div className="form-group">
                <input
                  type="date"
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.dueDate,
                  })}
                  name="dueDate"
                  value={form.dueDate || ""}
                  onChange={onChange}
                />
                {errors.dueDate && (
                  <div className="invalid-feedback">{errors.dueDate}</div>
                )}
              </div>
              <div className="form-group">
                <select
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.priority,
                  })}
                  name="priority"
                  value={form.priority || ""}
                  onChange={onChange}
                >
                  <option value="">Select Priority</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                {errors.priority && (
                  <div className="invalid-feedback">{errors.priority}</div>
                )}
              </div>

              <div className="form-group">
                <select
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.status,
                  })}
                  name="status"
                  value={form.status || ""}
                  onChange={onChange}
                >
                  <option value="">Select Status</option>
                  <option value="TO_DO">TO DO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
                {errors.status && (
                  <div className="invalid-feedback">{errors.status}</div>
                )}
              </div>

              <input type="submit" className="btn btn-primary btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

UpdateProjectTask.propTypes = {
  getProjectTask: PropTypes.func.isRequired,
  updateProjectTask: PropTypes.func.isRequired,
  project_task: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  project_task: state.backlog.project_task,
  errors: state.errors,
});

export default connect(mapStateToProps, { getProjectTask, updateProjectTask })(
  UpdateProjectTask,
);
