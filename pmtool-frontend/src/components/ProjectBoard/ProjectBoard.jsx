import PropTypes from "prop-types";
import { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getBacklog } from "../../actions/backlogActions";
import Backlog from "./Backlog";

const boardAlgorithm = (errors, projectTasks) => {
  if (projectTasks.length === 0) {
    if (errors.projectNotFound) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          {errors.projectNotFound}
        </div>
      );
    } else if (errors.projectIdentifier) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          {errors.projectIdentifier}
        </div>
      );
    } else {
      return (
        <div className="alert alert-info text-center" role="alert">
          No Project Tasks on this board
        </div>
      );
    }
  } else {
    return <Backlog project_tasks_prop={projectTasks} />;
  }
};

function ProjectBoard({ getBacklog }) {
  const { id } = useParams();
  const { project_tasks } = useSelector((state) => state.backlog);
  const errors = useSelector((state) => state.errors);
  const boardContent = boardAlgorithm(errors, project_tasks);

  useEffect(() => {
    getBacklog(id);
  }, [id, getBacklog]);

  return (
    <div className="container">
      <Link to={`/addProjectTask/${id}`} className="btn btn-primary mb-3">
        <i className="fas fa-plus-circle"> Create Project Task</i>
      </Link>
      <br />
      <hr />
      {boardContent}
    </div>
  );
}

ProjectBoard.propTypes = {
  getBacklog: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  backlog: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  backlog: state.backlog,
  errors: state.errors,
});

export default connect(mapStateToProps, { getBacklog })(ProjectBoard);
