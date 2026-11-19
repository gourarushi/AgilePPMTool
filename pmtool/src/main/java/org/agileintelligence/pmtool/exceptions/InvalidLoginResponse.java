package org.agileintelligence.pmtool.exceptions;

public class InvalidLoginResponse {

	private String username;
	private String password;
	public InvalidLoginResponse() {
		this.username = "Invalid Username";
		this.password = "Invalid Password";
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String userName) {
		this.username = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}
