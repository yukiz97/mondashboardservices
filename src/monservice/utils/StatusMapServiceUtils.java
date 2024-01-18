package monservice.utils;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;

import monservice.models.HostOfMapBean;
import monservice.models.NagiosMapBean;
import monservice.models.NagiosMapItemBean;
import monservice.models.ServiceOfHostStateBean;

public class StatusMapServiceUtils {
	public List<NagiosMapBean> getListDataForSlide(int id) throws Exception
	{
		ReadNagiosDat readNagiosDat = new ReadNagiosDat();
		
		Map<String, HostOfMapBean> mapHost = readNagiosDat.getHostDataForMap();
		Map<String, ServiceOfHostStateBean> mapServiceState = readNagiosDat.getServiceStateOfHost();
		
		List<NagiosMapBean> list = new ArrayList<NagiosMapBean>();

		Connection con = DatabaseUtils.returnNagiosMySQLConnection();

		String sqlGetMap = "SELECT * FROM dashboard_map WHERE 1=1 AND Status = 1";
		if(id!=-1)
		{
			sqlGetMap+=" AND idMap = "+id;
		}
		sqlGetMap+=" ORDER BY DateCreate DESC";
		ResultSet rsMap = con.createStatement().executeQuery(sqlGetMap);
		while(rsMap.next())
		{
			NagiosMapBean modelMap = returnMapBeanFromDB(rsMap);

			String sqlGetMapItem = "SELECT * FROM dashboard_map_items WHERE IdMap = "+modelMap.getIdMap();

			ResultSet rsMapItem = con.createStatement().executeQuery(sqlGetMapItem);

			while(rsMapItem.next())
			{
				
				NagiosMapItemBean modelMapItem = new NagiosMapItemBean();

				String hostName = rsMapItem.getString("IdItem");
				if(mapHost.get(hostName)==null)
						continue;
				System.out.println(hostName);
				System.out.println(mapHost.get(hostName).getHostName());
				int state = mapHost.get(hostName).getHostState();

				modelMapItem.setIdHost(hostName);
				modelMapItem.setX(rsMapItem.getInt("item-x"));
				modelMapItem.setY(rsMapItem.getInt("item-y"));

				if(state==0 && !isServicesOfHostHasIssue(modelMapItem.getIdHost(),mapServiceState))
				{
					modelMapItem.setCurrentState(0);
				}
				else
				{
					modelMapItem.setCurrentState(1);
				}
				modelMapItem.getListService().addAll(getAllServiceOfHost(modelMapItem.getIdHost(), mapServiceState));
				modelMap.getListItem().add(modelMapItem);
			}

			list.add(modelMap);
			
			rsMapItem.close();
		}
		rsMap.close();
		con.close();

		return list;
	}

	public boolean isServicesOfHostHasIssue(String hostId,Map<String, ServiceOfHostStateBean> mapServiceState) throws SQLException
	{
		boolean isIssue = false;
		for (Map.Entry<String, ServiceOfHostStateBean> entry : mapServiceState.entrySet()) {
			String[] arrayKey = entry.getKey().split(Pattern.quote("/"));

			if(arrayKey[1].equals(hostId))
			{
				if(entry.getValue().getServiceState()!=0)
				{
					isIssue=true;
					break;
				}
			}
		}
		
		return isIssue;
	}
	
	public List<ServiceOfHostStateBean> getAllServiceOfHost(String hostId,Map<String, ServiceOfHostStateBean> mapServiceState) throws SQLException
	{
		List<ServiceOfHostStateBean> listService = new ArrayList<ServiceOfHostStateBean>();
		for (Map.Entry<String, ServiceOfHostStateBean> entry : mapServiceState.entrySet()) {
			String[] arrayKey = entry.getKey().split(Pattern.quote("/"));

			if(arrayKey[1].equals(hostId))
			{
				listService.add(entry.getValue());
			}
		}
		
		return listService;
	}

	public NagiosMapBean returnMapBeanFromDB(ResultSet rs) throws Exception
	{
		NagiosMapBean model = new NagiosMapBean();
		
		byte[] bytes = IOUtils.toByteArray(rs.getBinaryStream("ImageMap"));
		String imgString = Base64.getEncoder().encodeToString(bytes);

		model.setIdMap(rs.getInt("IdMap"));
		model.setMapName(rs.getString("NameMap"));
		model.setImg(imgString);
		model.setStatus(rs.getInt("Status")==1?true:false);
		model.setDateCreate(rs.getDate("DateCreate"));
		
		return model;
	}
}