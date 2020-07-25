package monservice.models;

import java.util.Date;

public class WindowLogModel {
	
	private Object _id;
	private String id;
	Date DATE;
	String src_ip;
	String dst_ip;
	String action;
	public Object get_id() {
		return _id;
	}
	public void set_id(Object _id) {
		this._id = _id;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Date getDATE() {
		return DATE;
	}
	public void setDATE(Date dATE) {
		DATE = dATE;
	}
	public String getSrc_ip() {
		return src_ip;
	}
	public void setSrc_ip(String src_ip) {
		this.src_ip = src_ip;
	}
	public String getDst_ip() {
		return dst_ip;
	}
	public void setDst_ip(String dst_ip) {
		this.dst_ip = dst_ip;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	
	
	
}
