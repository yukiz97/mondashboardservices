package monservice.models;

public class ServiceOfHostStateBean {
	String hostName;
	String serviceName;
	int serviceState;
	String lastCheck;
	int currentAttempt;
	int maxAttempt;
	String output;
	
	public String getHostName() {
		return hostName;
	}
	public void setHostName(String hostName) {
		this.hostName = hostName;
	}
	public String getServiceName() {
		return serviceName;
	}
	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}
	public int getServiceState() {
		return serviceState;
	}
	public void setServiceState(int serviceState) {
		this.serviceState = serviceState;
	}
	public String getLastCheck() {
		return lastCheck;
	}
	public void setLastCheck(String lastCheck) {
		this.lastCheck = lastCheck;
	}
	public String getOutput() {
		return output;
	}
	public void setOutput(String output) {
		this.output = output;
	}
	public int getCurrentAttempt() {
		return currentAttempt;
	}
	public void setCurrentAttempt(int currentAttempt) {
		this.currentAttempt = currentAttempt;
	}
	public int getMaxAttempt() {
		return maxAttempt;
	}
	public void setMaxAttempt(int maxAttempt) {
		this.maxAttempt = maxAttempt;
	}
}
