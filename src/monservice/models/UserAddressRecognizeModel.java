package monservice.models;

public class UserAddressRecognizeModel {
	private int id;
	private String address;
	private String username;
	private String orgname;
	
	public UserAddressRecognizeModel(String ipAddress, String username, String orgname) {
		this.address = ipAddress;
		this.username = username;
		this.orgname = orgname;
	}
	
	public UserAddressRecognizeModel() {

	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getOrgname() {
		return orgname;
	}
	public void setOrgname(String orgname) {
		this.orgname = orgname;
	}
}
