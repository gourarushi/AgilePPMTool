import classnames from "classnames";
import PropTypes from "prop-types";
import { Component } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createProject, getProject } from "../../actions/projectActions";

class UpdateProject extends Component {
  //set state
  constructor() {
    super();

    this.state = {
      syncedProject: null,
      id: "",
      projectName: "",
      projectIdentifier: "",
      description: "",
      start_date: "",
      end_date: "",
      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    let newState = null;

    // 1. Sync project data if it has changed
    if (props.project !== state.syncedProject) {
      const project = props.project ?? {};
      newState = {
        ...newState,
        syncedProject: props.project,
        id: project.id ?? "",
        projectName: project.projectName ?? "",
        projectIdentifier: project.projectIdentifier ?? "",
        description: project.description ?? "",
        start_date: project.start_date ?? "",
        end_date: project.end_date ?? "",
      };
    }

    // 2. Sync errors if new errors are received from props
    if (props.errors && props.errors !== state.errors) {
      newState = {
        ...newState,
        errors: props.errors,
      };
    }
    return newState;
  }

  componentDidMount() {
    this.props.getProject(this.props.projectId, this.props.navigate);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.projectId !== this.props.projectId) {
      this.props.getProject(this.props.projectId, this.props.navigate);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const updateProject = {
      id: this.state.id,
      projectName: this.state.projectName,
      projectIdentifier: this.state.projectIdentifier,
      description: this.state.description,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
    };

    this.props.createProject(updateProject, this.props.navigate);
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="project">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h5 className="display-4 text-center">Update Project form</h5>
              <hr />
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.projectName,
                    })}
                    placeholder="Project Name"
                    name="projectName"
                    value={this.state.projectName}
                    onChange={this.onChange}
                  />
                  {errors.projectName && (
                    <div className="invalid-feedback">{errors.projectName}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Unique Project ID"
                    name="projectIdentifier"
                    value={this.state.projectIdentifier}
                    onChange={this.onChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <textarea
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.description,
                    })}
                    placeholder="Project Description"
                    name="description"
                    onChange={this.onChange}
                    value={this.state.description}
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>
                <h6>Start Date</h6>
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="start_date"
                    value={this.state.start_date}
                    onChange={this.onChange}
                  />
                </div>
                <h6>Estimated End Date</h6>
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="end_date"
                    value={this.state.end_date}
                    onChange={this.onChange}
                  />
                </div>

                <input
                  type="submit"
                  className="btn btn-primary btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpdateProject.propTypes = {
  getProject: PropTypes.func.isRequired,
  createProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project.project,
  errors: state.errors,
});

const ConnectedUpdateProject = connect(mapStateToProps, {
  getProject,
  createProject,
})(UpdateProject);

export default function UpdateProjectWithNavigation(props) {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  return (
    <ConnectedUpdateProject
      {...props}
      projectId={projectId}
      navigate={navigate}
    />
  );
}
