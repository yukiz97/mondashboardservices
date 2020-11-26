package monservice.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import monservice.models.HostOfMapBean;
import monservice.models.ServiceOfHostStateBean;
import monservice.models.hostoverview.HostOverviewModel;
import monservice.models.hostoverview.ServiceOfHostStateCountModel;

public class HostOverviewServiceUtils {
	static ReadNagiosDat nagiosDat;
	static ConfigPropertiesUtil utilConfig = new ConfigPropertiesUtil();
	static ReadXMLUtil utilReadXML;
	static {
		nagiosDat = new ReadNagiosDat();
		utilReadXML = new ReadXMLUtil(utilConfig.getProperty("xml.host.path"));
	}
	
	public static List<HostOverviewModel> getHostOverviewList(List<Integer> listHostStateFilter,List<Integer> listServiceStateFilter) {
		Map<String,HostOfMapBean> mapHost = nagiosDat.getHostDataForMap();
		Map<String, List<ServiceOfHostStateBean>> mapServices = nagiosDat.getListServiceStateOfHost();
		List<HostOverviewModel> listHostOverview = new ArrayList<HostOverviewModel>();
		
		try {
			utilReadXML.readXML();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		NodeList listNode = utilReadXML.getDocument().getElementsByTagName("host");
		for (int i = 0; i < listNode.getLength();i++) {
			Node node = listNode.item(i);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				Element element = (Element) node;
				
				String hostName = element.getElementsByTagName("host_name").item(0).getTextContent();
				String hostAddress = element.getElementsByTagName("address").item(0).getTextContent();
				int hostState;
				List<ServiceOfHostStateCountModel> listServiceCount = new ArrayList<ServiceOfHostStateCountModel>();
				
				if(mapHost.containsKey(hostName)) {
					hostState = mapHost.get(hostName).getHostState();
					
					if(!listHostStateFilter.contains(hostState)) {
						continue;
					}
				} else {
					continue;
				}
				
				List<ServiceOfHostStateBean> listServiceState = new ArrayList<ServiceOfHostStateBean>(); 
				if(mapServices.containsKey(hostName)) {
					listServiceState = mapServices.get(hostName);
				}
				Map<Integer, Integer> mapServiceState = new HashMap<Integer, Integer>();
				boolean isFilterService = false;
				for(ServiceOfHostStateBean model : listServiceState) {
					int state = model.getServiceState();
					
					if(mapServiceState.containsKey(state)) {
						mapServiceState.put(state,mapServiceState.get(state)+1);
					} else {
						mapServiceState.put(state, state);
					}
					
					if(listServiceStateFilter.contains(state) && !isFilterService) {
						isFilterService = true;
					}
				}
				if(!isFilterService)
					continue;
				
				for(Entry<Integer,Integer> entry : mapServiceState.entrySet()) {
					ServiceOfHostStateCountModel modelServiceCount = new ServiceOfHostStateCountModel();
					
					modelServiceCount.setState(entry.getKey());
					modelServiceCount.setCount(entry.getValue());
					
					listServiceCount.add(modelServiceCount);
				}
				
				HostOverviewModel modelHostOverview = new HostOverviewModel();
				modelHostOverview.setHostName(hostName);
				modelHostOverview.setHostIP(hostAddress);
				modelHostOverview.setHostState(hostState);
				modelHostOverview.setListServiceStateCount(listServiceCount);
				
				listHostOverview.add(modelHostOverview);
			}
		}
		
		return listHostOverview;
	}
}
