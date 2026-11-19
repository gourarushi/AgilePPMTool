package org.agileintelligence.pmtool.repositories;

import java.util.List;

import org.agileintelligence.pmtool.domain.ProjectTask;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectTaskRepository extends CrudRepository<ProjectTask, Long> {

	List<ProjectTask> findByProjectIdentifierOrderByPriority(String backlog_id);
	
	ProjectTask findByProjectSequence(String sequence);
	
}
