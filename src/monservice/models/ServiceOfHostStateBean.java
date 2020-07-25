package monservice.models;

public class ServiceOfHostStateBean {
	String hostName;
	String serviceName;
	int serviceState;
	
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
}
