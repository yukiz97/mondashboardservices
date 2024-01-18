package monservice.models;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Pattern;

public class IPWhiteListModel {
	private int id;
	private String name;
	private String sourceIp;
	private List<String> listRangeIp = new LinkedList<String>();
	private String strRangeIp;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSourceIp() {
		return sourceIp;
	}
	public void setSourceIp(String sourceIp) {
		this.sourceIp = sourceIp;
	}
	public List<String> getListRangeIp() {
		return listRangeIp;
	}
	public void setListRangeIp(List<String> listRangeIp) {
		this.listRangeIp = listRangeIp;
	}
	public String getStrRangeIp() {
		return strRangeIp;
	}
	public void setStrRangeIp(String strRangeIp) {
		this.strRangeIp = strRangeIp;
	}
}
