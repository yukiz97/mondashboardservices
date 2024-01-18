package monservice.models;

import java.util.ArrayList;
import java.util.List;

public class DynamicMapBlock {
	DynamicMapBean mapLeft;
	DynamicMapBean mapRight;
	 
	List<DynamicTemplateFilterModel> filter = new ArrayList<DynamicTemplateFilterModel>();
	List<IPWhiteListModel> whitelist = new ArrayList<IPWhiteListModel>();
	List<UserAddressRecognizeModel> useriprecognize = new ArrayList<UserAddressRecognizeModel>();
	
	public DynamicMapBean getMapLeft() {
		return mapLeft;
	}
	public void setMapLeft(DynamicMapBean mapLeft) {
		this.mapLeft = mapLeft;
	}
	public DynamicMapBean getMapRight() {
		return mapRight;
	}
	public void setMapRight(DynamicMapBean mapRight) {
		this.mapRight = mapRight;
	}
	public List<DynamicTemplateFilterModel> getFilter() {
		return filter;
	}
	public void setFilter(List<DynamicTemplateFilterModel> filter) {
		this.filter = filter;
	}
	public List<IPWhiteListModel> getWhitelist() {
		return whitelist;
	}
	public void setWhitelist(List<IPWhiteListModel> whitelist) {
		this.whitelist = whitelist;
	}
	public List<UserAddressRecognizeModel> getUseriprecognize() {
		return useriprecognize;
	}
	public void setUseriprecognize(List<UserAddressRecognizeModel> useriprecognize) {
		this.useriprecognize = useriprecognize;
	}
}
