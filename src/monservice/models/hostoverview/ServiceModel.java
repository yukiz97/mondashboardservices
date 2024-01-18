package monservice.models.hostoverview;

import java.io.Serializable;
import java.util.Date;

public class ServiceModel implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private int hostId;
	private int serviceId;
	private String hostName;
	private String hostAlias;
	private String hostAddress;
	private String serviceName;
	private int currentState;
	private String stringCurrentState;
	private String lastCheck;
	private Date lastTimeOk;
	private Date lasTimeUnknown;
	private int currentCheckAttemp;
	private int maxCheckAttemp;
	private String output;
	private String duration;
	private String statusInformation;
	
	public int getHostId() {
		return hostId;
	}


	public void setHostId(int hostId) {
		this.hostId = hostId;
	}


	public int getServiceId() {
		return serviceId;
	}


	public void setServiceId(int serviceId) {
		this.serviceId = serviceId;
	}


	public String getHostName() {
		return hostName;
	}


	public void setHostName(String hostName) {
		this.hostName = hostName;
	}


	public String getHostAlias() {
		return hostAlias;
	}


	public void setHostAlias(String hostAlias) {
		this.hostAlias = hostAlias;
	}


	public String getServiceName() {
		return serviceName;
	}


	public void setServiceName(String serviceName) {
		this.serviceName = serviceName.replace("-", " ");
	}


	public int getCurrentState() {
		return currentState;
	}


	public void setCurrentState(int currentState) {
		this.currentState = currentState;
		if(this.currentState == 0) this.stringCurrentState = "OK";
		if(this.currentState == 1) this.stringCurrentState = "Warning";
		if(this.currentState == 2) this.stringCurrentState = "Critical";
		if(this.currentState == 3) this.stringCurrentState = "Unknown";
		if(this.currentState == 4) this.stringCurrentState = "Pending";
	}


	public String getStringCurrentState() {
		return stringCurrentState;
	}

	public void setStringCurrentState(String stringCurrentState) {
		this.stringCurrentState = stringCurrentState;
	}

	public String getLastCheck() {
		return lastCheck;
	}

	public void setLastCheck(String lastCheck) {
		this.lastCheck = lastCheck;
	}

	public Date getLastTimeOk() {
		return lastTimeOk;
	}

	public void setLastTimeOk(Date lastTimeOk) {
		this.lastTimeOk = lastTimeOk;
	}

	public Date getLasTimeUnknown() {
		return lasTimeUnknown;
	}

	public void setLasTimeUnknown(Date lasTimeUnknown) {
		this.lasTimeUnknown = lasTimeUnknown;
	}


	public int getCurrentCheckAttemp() {
		return currentCheckAttemp;
	}

	public void setCurrentCheckAttemp(int currentCheckAttemp) {
		this.currentCheckAttemp = currentCheckAttemp;
	}

	public int getMaxCheckAttemp() {
		return maxCheckAttemp;
	}

	public void setMaxCheckAttemp(int maxCheckAttemp) {
		this.maxCheckAttemp = maxCheckAttemp;
	}

	public String getOutput() {
		return output;
	}

	public void setOutput(String output) {
		this.output = output;
	}

	public String getDuration() {
		return duration;
	}


	public void setDuration(String duration) {
		this.duration = duration;
	}
	
	public String getStatusInformation() {
		return statusInformation;
	}

	public void setStatusInformation(String statusInformation) {
		this.statusInformation = statusInformation;
	}

	public String getFilter() {
		return this.hostAlias+" "+this.serviceName+" "+this.stringCurrentState+" "+this.lastCheck+" "+ this.output+" "+this.statusInformation ;
	}

	public String getHostAddress() {
		return hostAddress;
	}


	public void setHostAddress(String hostAddress) {
		this.hostAddress = hostAddress;
	}
}
