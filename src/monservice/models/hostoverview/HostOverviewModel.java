package monservice.models.hostoverview;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class HostOverviewModel {
	String hostName;
	String hostIP;
	int hostState;
	List<ServiceOfHostStateCountModel> listServiceStateCount = new ArrayList<ServiceOfHostStateCountModel>();
	
	public String getHostName() {
		return hostName;
	}
	public void setHostName(String hostName) {
		this.hostName = hostName;
	}
	public String getHostIP() {
		return hostIP;
	}
	public void setHostIP(String hostIP) {
		this.hostIP = hostIP;
	}
	public int getHostState() {
		return hostState;
	}
	public void setHostState(int hostState) {
		this.hostState = hostState;
	}
	public List<ServiceOfHostStateCountModel> getListServiceStateCount() {
		return listServiceStateCount;
	}
	public void setListServiceStateCount(List<ServiceOfHostStateCountModel> listServiceStateCount) {
		this.listServiceStateCount = listServiceStateCount;
	}
}
