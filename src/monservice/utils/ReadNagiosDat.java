package monservice.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.SystemUtils;

import monservice.models.HostOfMapBean;
import monservice.models.ServiceOfHostStateBean;

public class ReadNagiosDat {
	File fileDat;

	String strFileStatus = "";
	String strFileRetention = "";

	SimpleDateFormat sdfDatetime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	public ReadNagiosDat() {
		if(SystemUtils.IS_OS_WINDOWS)
		{
			strFileStatus = "D:\\DevApps\\_Workspace\\Java\\Eclipse\\monitor\\.mydata\\monitoring\\status.dat";
			strFileRetention = "D:\\DevApps\\_Workspace\\Java\\Eclipse\\monitor\\.mydata\\monitoring\\retention.dat";
		}
		else
		{
			strFileStatus = MonConfigPropertiesUtil.getProperty("status.dat");
			strFileRetention = MonConfigPropertiesUtil.getProperty("retention.dat");
		}
	}

	public Map<String,HostOfMapBean> getHostDataForMap()
	{
		Map<String,HostOfMapBean> mapHost = new HashMap<String, HostOfMapBean>();

		boolean isStatus = true;
		boolean isHostStatus = false;

		File fileStatus = new File(strFileStatus);

		if(fileStatus.exists())
		{
			fileDat = fileStatus;
		}
		else
		{
			File fileRetention = new File(strFileRetention);

			if(fileRetention.exists())
			{
				fileDat = fileRetention;

				isStatus = false;
			}
			else
			{
				return mapHost;
			}
		}

		try {
			BufferedReader br = new BufferedReader(new FileReader(fileDat));

			String st; 
			HostOfMapBean hostModel = null;
			while ((st = br.readLine()) != null) {
				if((st.contains("host") && st.contains("{") && !isStatus) || (st.contains("hoststatus") && st.contains("{") && isStatus)) 
				{
					isHostStatus = true;
					hostModel = new HostOfMapBean();
				}
				else if(st.trim().contains("}")) 
				{
					if(isHostStatus) 
					{
						isHostStatus = false;
						mapHost.put(hostModel.getHostName(), hostModel);
					}
				}

				if(isHostStatus) 
				{
					String leftString ="";
					String rightString ="";

					try {
						st = st.replaceFirst("=", "!@#");

						leftString = st.split("!@#")[0].trim();
						rightString = st.split("!@#")[1].trim();
					}catch(Exception e) {

					}

					if(leftString.equals("host_name")) 
					{
						hostModel.setHostName(rightString);
					}
					else if(leftString.equals("current_state")) 
					{
						hostModel.setHostState(Integer.parseInt(rightString));
					}
				}

			} 
			br.close();

		} catch (Exception e) {
			e.printStackTrace();
		}

		return mapHost;
	}

	public Map<String,ServiceOfHostStateBean> getServiceStateOfHost()
	{
		Map<String,ServiceOfHostStateBean> mapService = new HashMap<String, ServiceOfHostStateBean>();

		boolean isStatus = false;
		boolean isHostStatus = false;

		File fileStatus = new File(strFileStatus);

		if(fileStatus.exists())
		{
			fileDat = fileStatus;
		}
		else
		{
			File fileRetention = new File(strFileRetention);

			if(fileRetention.exists())
			{
				fileDat = fileRetention;

				isStatus = false;
			}
			else
			{
				return mapService;
			}
		}

		try {
			BufferedReader br = new BufferedReader(new FileReader(fileDat));

			String st; 
			ServiceOfHostStateBean serviceModel = null;
			while ((st = br.readLine()) != null) {
				if((st.contains("servicestatus") && st.contains("{") && isStatus) || (st.contains("service") && st.contains("{") && !isStatus)) 
				{
					isHostStatus = true;
					serviceModel = new ServiceOfHostStateBean();
				}
				else if(st.trim().contains("}")) 
				{
					if(isHostStatus) 
					{
						isHostStatus = false;
						mapService.put(serviceModel.getServiceName()+"/"+serviceModel.getHostName(), serviceModel);
					}
				}

				if(isHostStatus) {
					String leftString ="";
					String rightString ="";

					try {
						st = st.replaceFirst("=", "!@#");

						leftString = st.split("!@#")[0].trim();
						rightString = st.split("!@#")[1].trim();
					}catch(Exception e) {

					}
					//add value to service model
					if(leftString.equals("host_name")) 
					{
						serviceModel.setHostName(rightString);
					}
					else if(leftString.equals("current_state")) 
					{
						serviceModel.setServiceState(Integer.parseInt(rightString));
					}
					else if(leftString.equals("service_description"))
					{
						serviceModel.setServiceName(rightString);
					}
				}

			} 
			br.close();

		} catch (Exception e) {
			e.printStackTrace();
		}

		return mapService;
	}
	
	public Map<String,List<ServiceOfHostStateBean>> getListServiceStateOfHost()
	{
		Map<String,List<ServiceOfHostStateBean>> mapService = new HashMap<String,List<ServiceOfHostStateBean>>();

		boolean isStatus = false;
		boolean isHostStatus = false;

		File fileStatus = new File(strFileStatus);

		if(fileStatus.exists())
		{
			fileDat = fileStatus;
		}
		else
		{
			File fileRetention = new File(strFileRetention);

			if(fileRetention.exists())
			{
				fileDat = fileRetention;

				isStatus = false;
			}
			else
			{
				return mapService;
			}
		}

		try {
			BufferedReader br = new BufferedReader(new FileReader(fileDat));

			String st; 
			ServiceOfHostStateBean serviceModel = null;
			while ((st = br.readLine()) != null) {
				if((st.contains("servicestatus") && st.contains("{") && isStatus) || (st.contains("service") && st.contains("{") && !isStatus)) 
				{
					isHostStatus = true;
					serviceModel = new ServiceOfHostStateBean();
				}
				else if(st.trim().contains("}")) 
				{
					if(isHostStatus) 
					{
						isHostStatus = false;
						
						if(mapService.containsKey(serviceModel.getHostName())) {
							mapService.get(serviceModel.getHostName()).add(serviceModel);
						} else {
							List<ServiceOfHostStateBean> listService = new ArrayList<ServiceOfHostStateBean>();
							listService.add(serviceModel);
							mapService.put(serviceModel.getHostName(),listService);
						}
					}
				}

				if(isHostStatus) {
					String leftString ="";
					String rightString ="";

					try {
						st = st.replaceFirst("=", "!@#");

						leftString = st.split("!@#")[0].trim();
						rightString = st.split("!@#")[1].trim();
					}catch(Exception e) {

					}
					//add value to service model
					if(leftString.equals("host_name")) 
					{
						serviceModel.setHostName(rightString);
					}
					else if(leftString.equals("current_state")) 
					{
						serviceModel.setServiceState(Integer.parseInt(rightString));
					}
					else if(leftString.equals("service_description"))
					{
						serviceModel.setServiceName(rightString);
					}
				}

			} 
			br.close();

		} catch (Exception e) {
			e.printStackTrace();
		}

		return mapService;
	}
}
