package monservice.models;

import java.util.List;

public class DynamicMapBean {
	String mapName;
	String background;
	String code;
	List<DynamicMapItemBean> items;
	
	public String getMapName() {
		return mapName;
	}
	public void setMapName(String mapName) {
		this.mapName = mapName;
	}
	public String getBackground() {
		return background;
	}
	public void setBackground(String background) {
		this.background = background;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public List<DynamicMapItemBean> getItems() {
		return items;
	}
	public void setItems(List<DynamicMapItemBean> items) {
		this.items = items;
	}
}
