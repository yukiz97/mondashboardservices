package monservice.models;

public class FlowViewItemBean {
	int id;
	GeneralDualStringBean sourceCode;
	String sourceIp;
	GeneralDualStringBean desCode;
	String desIp;
	int severity;
	String signature;
	int port;
	int check;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getSourceIp() {
		return sourceIp;
	}
	public void setSourceIp(String sourceIp) {
		this.sourceIp = sourceIp;
	}
	public String getDesIp() {
		return desIp;
	}
	public void setDesIp(String desIp) {
		this.desIp = desIp;
	}
	public int getSeverity() {
		return severity;
	}
	public void setSeverity(int severity) {
		this.severity = severity;
	}
	public String getSignature() {
		return signature;
	}
	public void setSignature(String signature) {
		this.signature = signature;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public int getCheck() {
		return check;
	}
	public void setCheck(int check) {
		this.check = check;
	}
	public GeneralDualStringBean getSourceCode() {
		return sourceCode;
	}
	public void setSourceCode(GeneralDualStringBean sourceCode) {
		this.sourceCode = sourceCode;
	}
	public GeneralDualStringBean getDesCode() {
		return desCode;
	}
	public void setDesCode(GeneralDualStringBean desCode) {
		this.desCode = desCode;
	}
}
