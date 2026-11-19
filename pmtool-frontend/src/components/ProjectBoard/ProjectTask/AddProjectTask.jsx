import classnames from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addProjectTask } from "../../../actions/backlogActions";

function AddProjectTask({ addProjectTask, errors }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    summary: "",
    acceptanceCriteria: "",
    status: "",
    priority: "",
    dueDate: "",
  });

  const payload = {
    ...form,
    priority: form.priority || null,
    status: form.status || null,
    projectIdentifier: id,
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    addProjectTask(id, payload, navigate);
  };

  return (
    <div className="add-PBI">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <Link to={`/projectBoard/${id}`} className="btn btn-light">
              Back to Project Board
            </Link>
            <h4 className="display-4 text-center">Add Project Task</h4>
            <p className="lead text-center">Project Name + Project Code</p>
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
                  value={form.summary}
                  onChange={onChange}
                  placeholder="Project Task summary"
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
                  value={form.acceptanceCriteria}
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
                  value={form.dueDate}
                  onChange={onChange}
                />
                {errors.dueDate && (
                  <div className="invalid-feedback">{errors.dueDate}</div>
                )}
              </div>
              <div className="form-group">
                <select
                  className={classnames("form-select form-select-lg", {
                    "is-invalid": errors.priority,
                  })}
                  name="priority"
                  value={form.priority}
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
                  className={classnames("form-select form-select-lg", {
                    "is-invalid": errors.status,
                  })}
                  name="status"
                  value={form.status}
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

AddProjectTask.propTypes = {
  addProjectTask: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
});

export default connect(mapStateToProps, { addProjectTask })(AddProjectTask);
