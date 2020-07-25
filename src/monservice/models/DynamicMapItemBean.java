package monservice.models;

public class DynamicMapItemBean {
	String code;
	String name;
	float x;
	float y;
	
	int mapLevel2Id = -1;
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public float getX() {
		return x;
	}
	public void setX(float x) {
		this.x = x;
	}
	public float getY() {
		return y;
	}
	public void setY(float y) {
		this.y = y;
	}
	public int getMapLevel2Id() {
		return mapLevel2Id;
	}
	public void setMapLevel2Id(int mapLevel2Id) {
		this.mapLevel2Id = mapLevel2Id;
	}
}
