package monservice.utils;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.apache.commons.io.IOUtils;

import monservice.models.DynamicSVGMapBean;
import monservice.models.DynamicSVGMapItemBean;

public class DynamicSVGMapServiceUtils {
	public DynamicSVGMapBean getDynamicMap(int idMap) throws Exception
	{	
		DynamicSVGMapBean model = new DynamicSVGMapBean();
		
		Connection con = DatabaseUtils.returnConnectivityMapConnection();
		String sqlGetMap = "SELECT * FROM maps WHERE idMap="+idMap;
		
		ResultSet rsGetMap = con.createStatement().executeQuery(sqlGetMap);
		
		while(rsGetMap.next())
		{
			byte[] bytes = IOUtils.toByteArray(rsGetMap.getBinaryStream("backgroundMap"));
			String imgString = Base64.getEncoder().encodeToString(bytes);
			List<DynamicSVGMapItemBean> listItem = new ArrayList<DynamicSVGMapItemBean>();
			
			model.setIdMap(rsGetMap.getInt("idMap"));
			model.setNameMap(rsGetMap.getString("nameMap"));
			model.setBackgroundMap(imgString);
			model.setTypeData(rsGetMap.getString("typeData"));
			model.setItems(listItem);
			
			String sqlGetCustomItem = "SELECT * FROM coordinate_custom WHERE idMap = "+idMap;
			
			ResultSet rsGetCustomItem = con.createStatement().executeQuery(sqlGetCustomItem);
			
			while(rsGetCustomItem.next())
			{
				DynamicSVGMapItemBean modelItem = new DynamicSVGMapItemBean();
				
				modelItem.setValue(rsGetCustomItem.getString("ip"));
				modelItem.setName(rsGetCustomItem.getString("name"));
				modelItem.setCx(rsGetCustomItem.getFloat("cx"));
				modelItem.setCy(rsGetCustomItem.getFloat("cy"));
				
				listItem.add(modelItem);
			}
			

			String sqlGetDefaultItem = "SELECT * FROM coordinate_default WHERE typeCoordinate = '"+rsGetMap.getString("typeMap")+"'";
			System.out.println(sqlGetDefaultItem);
			ResultSet rsGetDefaultItem = con.createStatement().executeQuery(sqlGetDefaultItem);
			
			while(rsGetDefaultItem.next())
			{
				DynamicSVGMapItemBean modelItem = new DynamicSVGMapItemBean();
				
				modelItem.setValue(rsGetDefaultItem.getString("valueId"));
				modelItem.setName(rsGetDefaultItem.getString("name"));
				modelItem.setCx(rsGetDefaultItem.getFloat("cx"));
				modelItem.setCy(rsGetDefaultItem.getFloat("cy"));
				
				listItem.add(modelItem);
			}
		}
		
		return model;
	}
}
