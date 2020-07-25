package monservice.models;

public class TriggerBean {
	String id;
	String description;
	String keysearch_01;
	String keysearch_02;
	String keysearch_03;
	String keysearch_04;
	String keysearch_05;
	String program;
	String facility;
	String severity;
	String host;
	String alias;
	String priority;
	int count;
	String dateCreate;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id.replace("-", "_");
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getKeysearch_01() {
		return keysearch_01;
	}
	public void setKeysearch_01(String key) {
		this.keysearch_01 = key;
	}
	public String getKeysearch_02() {
		return keysearch_02;
	}
	public void setKeysearch_02(String keysearch_02) {
		this.keysearch_02 = keysearch_02;
	}
	public String getKeysearch_03() {
		return keysearch_03;
	}
	public void setKeysearch_03(String keysearch_03) {
		this.keysearch_03 = keysearch_03;
	}
	public String getKeysearch_04() {
		return keysearch_04;
	}
	public void setKeysearch_04(String keysearch_04) {
		this.keysearch_04 = keysearch_04;
	}
	public String getKeysearch_05() {
		return keysearch_05;
	}
	public void setKeysearch_05(String keysearch_05) {
		this.keysearch_05 = keysearch_05;
	}
	public String getKeySearchAll(){
		String keySearch="";
		if(getKeysearch_01().isEmpty()==false)
			keySearch+="1) "+getKeysearch_01();
		
		if(getKeysearch_02().isEmpty()==false)
			keySearch+=" , 2) "+getKeysearch_02();
		
		if(getKeysearch_03().isEmpty()==false)
			keySearch+=" , 3) "+getKeysearch_03();
		
		if(getKeysearch_04().isEmpty()==false)
			keySearch+=" , 4) "+getKeysearch_04();
		
		if(getKeysearch_05().isEmpty()==false)
			keySearch+=" , 5) "+getKeysearch_05();
		
		return keySearch;
	}
	public String getProgram() {
		return program;
	}
	public void setProgram(String program) {
		this.program = program;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public String getDateCreate() {
		return dateCreate;
	}
	public void setDateCreate(String dateCreate) {
		this.dateCreate = dateCreate;
	}
	public String getCollection(){
		if(id.contains("trigger_"))
			return id;
		return "trigger_"+id;
	}
	public String getFacility() {
		return facility;
	}
	public int getFacilityInt(){
		try {
			return Integer.parseInt(facility);
		} catch (Exception e) {
			return -1;
		}
	}
	public void setFacility(String facility) {
		this.facility = facility;
	}
	public String getSeverity() {
		return severity;
	}
	public int getSeverityInt(){
		try {
			return Integer.parseInt(severity);
		} catch (Exception e) {
			return -1;
		}
	}
	public void setSeverity(String serverity) {
		this.severity = serverity;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
}
