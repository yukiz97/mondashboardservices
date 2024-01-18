package monservice.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class NagiosMapBean {
	private int idMap;
	private String mapName;
	private String imgName;
	private boolean status;
	private Date dateCreate;
	private List<NagiosMapItemBean> listItem = new ArrayList<NagiosMapItemBean>();
	
	public String getMapName() {
		return mapName;
	}
	public void setMapName(String mapName) {
		this.mapName = mapName;
	}
	public String getImg() {
		return imgName;
	}
	public void setImg(String imgName) {
		this.imgName = imgName;
	}
	public int getIdMap() {
		return idMap;
	}
	public void setIdMap(int idMap) {
		this.idMap = idMap;
	}
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	public Date getDateCreate() {
		return dateCreate;
	}
	public void setDateCreate(Date dateCreate) {
		this.dateCreate = dateCreate;
	}
	public List<NagiosMapItemBean> getListItem() {
		return listItem;
	}
	public void setListItem(List<NagiosMapItemBean> listItem) {
		this.listItem = listItem;
	}
}
