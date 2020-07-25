package monservice.models;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public class RangeIPModel {
	int id = 0;
	String code;
	String parentCode;
	String name;
	List<String> listRangeIp = new ArrayList<String>();
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getParentCode() {
		return parentCode;
	}
	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<String> getListRangeIp() {
		return listRangeIp;
	}
	public void setListRangeIp(String strValue) {
		this.listRangeIp = new ArrayList<String>(Arrays.asList(strValue.trim().replaceAll("\\s+", " ").split(Pattern.quote(","))));
	}
}
