package monservice.models;

import java.util.ArrayList;
import java.util.List;

public class HostTriggerBean {
	private HostBean hostBean=new HostBean();
	private List<TriggerBean> triggerBean=new ArrayList<TriggerBean>();
	private int HighCount=0;
	private int MediumCount=0;
	private int LowCount=0;
	
	public HostTriggerBean() {

	}

	public HostBean getHostBean() {
		return hostBean;
	}

	public void setHostBean(HostBean hostBean) {
		this.hostBean = hostBean;
	}

	public List<TriggerBean> getTriggerBean() {
		return triggerBean;
	}

	public void setTriggerBean(List<TriggerBean> triggerBean) {
		this.triggerBean = triggerBean;
	}

	public int getHighCount() {
		return HighCount;
	}

	public void setHighCount(int highCount) {
		HighCount = highCount;
	}

	public void plusHighCount(int highCount) {
		this.HighCount += highCount;
	}
	
	public int getMediumCount() {
		return MediumCount;
	}

	public void setMediumCount(int mediumCount) {
		MediumCount = mediumCount;
	}

	public void plusMediumCount(int mediumCount) {
		this.MediumCount += mediumCount;
	}
	
	public int getLowCount() {
		return LowCount;
	}

	public void setLowCount(int lowCount) {
		LowCount = lowCount;
	}
	
	public void plusLowCount(int lowCount) {
		this.LowCount += lowCount;
	}
}
