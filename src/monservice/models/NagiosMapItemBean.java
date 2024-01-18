package monservice.models;

import java.util.ArrayList;
import java.util.List;

public class NagiosMapItemBean {
	String idHost;
	int x;
	int y;
	int currentState;
	List<ServiceOfHostStateBean> listService = new ArrayList<ServiceOfHostStateBean>();
	
	public int getX() {
		return x;
	}
	public void setX(int x) {
		this.x = x;
	}
	public int getY() {
		return y;
	}
	public void setY(int y) {
		this.y = y;
	}
	public int getCurrentState() {
		return currentState;
	}
	public void setCurrentState(int currentState) {
		this.currentState = currentState;
	}
	public String getIdHost() {
		return idHost;
	}
	public void setIdHost(String idHost) {
		this.idHost = idHost;
	}
	public List<ServiceOfHostStateBean> getListService() {
		return listService;
	}
	public void setListService(List<ServiceOfHostStateBean> listService) {
		this.listService = listService;
	}
}
