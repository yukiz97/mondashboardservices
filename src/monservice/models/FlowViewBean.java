package monservice.models;

import java.util.List;

public class FlowViewBean {
	private List<GeneralDualStringBean> configs;
	private List<FlowViewItemBean> items;
	
	public List<GeneralDualStringBean> getConfigs() {
		return configs;
	}
	public void setConfigs(List<GeneralDualStringBean> configs) {
		this.configs = configs;
	}
	public List<FlowViewItemBean> getItems() {
		return items;
	}
	public void setItems(List<FlowViewItemBean> items) {
		this.items = items;
	}
}
