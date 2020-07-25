package monservice.models;

public class NagiosMapItemBean {
	String idHost;
	int x;
	int y;
	int currentState;
	
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
}
