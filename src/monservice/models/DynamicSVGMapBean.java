package monservice.models;

import java.util.List;

public class DynamicSVGMapBean {
	int idMap;
	String nameMap;
	String backgroundMap;
	String typeData;
	List<DynamicSVGMapItemBean> items;
	
	public int getIdMap() {
		return idMap;
	}
	public void setIdMap(int idMap) {
		this.idMap = idMap;
	}
	public String getNameMap() {
		return nameMap;
	}
	public void setNameMap(String nameMap) {
		this.nameMap = nameMap;
	}
	public String getBackgroundMap() {
		return backgroundMap;
	}
	public void setBackgroundMap(String backgroundMap) {
		this.backgroundMap = backgroundMap;
	}
	public String getTypeData() {
		return typeData;
	}
	public void setTypeData(String typeData) {
		this.typeData = typeData;
	}
	public List<DynamicSVGMapItemBean> getItems() {
		return items;
	}
	public void setItems(List<DynamicSVGMapItemBean> items) {
		this.items = items;
	}
}
