package org.agileintelligence.pmtool.services;

import java.util.List;

import org.agileintelligence.pmtool.domain.Backlog;
import org.agileintelligence.pmtool.domain.ProjectTask;
import org.agileintelligence.pmtool.enums.Priority;
import org.agileintelligence.pmtool.enums.Status;
import org.agileintelligence.pmtool.exceptions.ProjectNotFoundException;
import org.agileintelligence.pmtool.repositories.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectTaskService {

	@Autowired
	private ProjectTaskRepository projectTaskRepository;
	
	@Autowired
	private ProjectService projectService;
	
	public ProjectTask addProjectTask(String projectIdentifier, ProjectTask projectTask, String username) {
		
		// Exceptions: Project not found

			// All Project tasks to be added to the specific project, project != null (Backlog exists)
			Backlog backlog = projectService.findProjectByIdentifier(projectIdentifier, username).getBacklog();//backlogRepository.findByProjectIdentifier(projectIdentifier);
			// project is null still the Backlog exists as we have a relationship one to many. 
			// If we create a task then we need a backlog which can refer the task to. 
			// set the Backlog to the Project Tasks
			projectTask.setBacklog(backlog);
			// we want or project sequence to be like this: IDPRO-1, IDPRO-2
			Integer backlogSequence = backlog.getPTSequence();
			// Update the Backlog Sequence
			backlogSequence++;
			backlog.setPTSequence(backlogSequence);
			
			// Add sequence to ProjectTasks
			projectTask.setProjectSequence(projectIdentifier+"-"+backlogSequence);
			projectTask.setProjectIdentifier(projectIdentifier);
			
			// Initial priority when priority is null
			if (projectTask.getPriority() == null) {
				projectTask.setPriority(Priority.LOW);
			}
			// Initial Status when status is null
			if (projectTask.getStatus() == null) {
				projectTask.setStatus(Status.TO_DO);
			}
			
			return projectTaskRepository.save(projectTask);
	
	}

	public List<ProjectTask> findBacklogById(String backlog_id, String username) {
		// while retriving backlog with project id and it does not exists 
		// http://localhost:8080/api/backlog/ID013 and ID013 does not exists
		projectService.findProjectByIdentifier(backlog_id, username);
		
		return projectTaskRepository.findByProjectIdentifierOrderByPriority(backlog_id);
	}
	
	// @param backlog_id and projectTask_id
	public ProjectTask findPTByProjectSequence(String backlog_id, String pt_id, String username) {
		
		// make sure we are searching on the existing backlog
		projectService.findProjectByIdentifier(backlog_id, username);
		
		// make sure that our task exists
		ProjectTask projectTask = projectTaskRepository.findByProjectSequence(pt_id);
		if (projectTask == null) {
			throw new ProjectNotFoundException("Project Task: '"+pt_id+"' not found");
		}
		
		// make sure that the backlog/project id in the path corresponds to the right project
		if (!projectTask.getProjectIdentifier().equals(backlog_id)) {
			throw new ProjectNotFoundException("Project Task '"+pt_id+"' does not exists in project: '"+backlog_id);
		}
		return projectTask;
	}
	
	// Update project Task
	public ProjectTask updateByProjectSequence(ProjectTask updatedTask, String backlog_id, String pt_id, String username) {
		// Find existing project Task
		ProjectTask projectTask = findPTByProjectSequence(backlog_id, pt_id, username);
		// Replace it with Updated Task
		projectTask = updatedTask;
		// Save update
		return projectTaskRepository.save(projectTask);	
	}
	
	public void deletePTByProjectSequence(String backlog_id, String pt_id, String username) {
		ProjectTask projectTask = findPTByProjectSequence(backlog_id, pt_id, username);
		projectTaskRepository.delete(projectTask);
	}
}
