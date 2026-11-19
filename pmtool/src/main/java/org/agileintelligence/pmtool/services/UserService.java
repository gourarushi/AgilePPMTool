package org.agileintelligence.pmtool.services;

import org.agileintelligence.pmtool.domain.User;
import org.agileintelligence.pmtool.exceptions.UsernameAlreadyExistsException;
import org.agileintelligence.pmtool.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	public User saveUser(User newUser) {
		try {
			newUser.setPassword(bCryptPasswordEncoder.encode(newUser.getPassword()));
			
			//Username has to be unique (Exception)
			newUser.setUsername(newUser.getUsername());
			
			//Make sure that password and confirm password match
			// Make sure we don't persist with confirm password
			newUser.setConfirmPassword("");
			return userRepository.save(newUser);
		} catch (Exception e) {
			throw new UsernameAlreadyExistsException("Username '"+newUser.getUsername()+"' already exists");
		}
		
	}
}
