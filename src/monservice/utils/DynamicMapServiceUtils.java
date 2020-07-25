package monservice.utils;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;

import monservice.models.DynamicMapBean;
import monservice.models.DynamicMapBlock;
import monservice.models.DynamicMapItemBean;
import monservice.models.DynamicSVGMapBean;
import monservice.models.DynamicSVGMapItemBean;
import monservice.models.RangeIPModel;

public class DynamicMapServiceUtils {
	public DynamicMapBlock getDynamicMap(int idLeft,int idRight) throws Exception
	{
		DynamicMapBlock model = new DynamicMapBlock();

		Connection con = DatabaseUtils.returnConnectivityMapConnection();
		String sqlGetMap = "SELECT * FROM map WHERE Id IN ("+idLeft+","+idRight+")";

		ResultSet rsGetMap = con.createStatement().executeQuery(sqlGetMap);

		while(rsGetMap.next())
		{
			int idMap = rsGetMap.getInt("Id");
			DynamicMapBean modelMap = new DynamicMapBean();
			List<DynamicMapItemBean> listItem = new ArrayList<DynamicMapItemBean>();
			
			Map<String, DynamicMapItemBean> mapItem = new HashMap<String, DynamicMapItemBean>();
			String strCodeRangeIp = "";

			byte[] bytes = IOUtils.toByteArray(rsGetMap.getBinaryStream("MapImage"));
			String imgString = Base64.getEncoder().encodeToString(bytes);
			
			modelMap.setMapName(rsGetMap.getString("MapName"));
			modelMap.setBackground(imgString);
			modelMap.setCode(rsGetMap.getString("RangeIp"));
			modelMap.setItems(listItem);

			String sqlGetItem = "SELECT b.Code,b.Name,x,y FROM map_coordinate a,location_rangeip b WHERE a.IdRangeIp = b.Id AND IdMap = "+idMap;

			ResultSet rsGetItem = con.createStatement().executeQuery(sqlGetItem);

			while(rsGetItem.next())
			{
				String code = rsGetItem.getString("Code");
				
				DynamicMapItemBean modelItem = new DynamicMapItemBean();
				modelItem.setCode(code);
				modelItem.setName(rsGetItem.getString("Name"));
				modelItem.setX(rsGetItem.getFloat("x"));
				modelItem.setY(rsGetItem.getFloat("y"));

				listItem.add(modelItem);
				mapItem.put(code, modelItem);
				
				strCodeRangeIp+="'"+code+"',";
			}
			
			if(modelMap.getCode().equals("level-1") && !strCodeRangeIp.isEmpty())
			{
				strCodeRangeIp = strCodeRangeIp.substring(0,strCodeRangeIp.length()-1);
				String sqlGetMapLevel2Id = "SELECT RangeIp,Id FROM map WHERE RangeIp IN ("+strCodeRangeIp+")";
				
				ResultSet rsGetMapLevel2 = con.createStatement().executeQuery(sqlGetMapLevel2Id);
				
				while(rsGetMapLevel2.next())
				{
					mapItem.get(rsGetMapLevel2.getString("RangeIp")).setMapLevel2Id(rsGetMapLevel2.getInt("Id"));
				}
				
				rsGetMapLevel2.close();
			}

			if(idMap==idLeft)
			{
				model.setMapLeft(modelMap);
			}
			else
			{
				model.setMapRight(modelMap);
			}
			
			rsGetItem.close();
		}
		
		rsGetMap.close();
		con.close();

		return model;
	}

	public static Map<String, RangeIPModel> getAllRangeIpOfParent(String codeParent) throws SQLException
	{
		Map<String, RangeIPModel> mapIPRange = new HashMap<String, RangeIPModel>();
		Connection con = DatabaseUtils.returnConnectivityMapConnection();
		String sql = "SELECT * FROM location_rangeip WHERE ParentCode = '"+codeParent+"'";
		ResultSet rs = con.createStatement().executeQuery(sql);

		while(rs.next())
		{
			String rangeIp = rs.getString("RangeIp")!=null?rs.getString("RangeIp").trim().replaceAll("\\s+", " "):null;
			String code = rs.getString("Code");

			RangeIPModel model = new RangeIPModel();

			model.setId(rs.getInt("Id"));
			model.setCode(code);
			model.setParentCode(rs.getString("ParentCode"));
			model.setName(rs.getNString("Name"));
			if(rangeIp!=null && rangeIp.length()>0)
			{
				model.setListRangeIp(rangeIp);
			}

			mapIPRange.put(code, model);
		}

		rs.close();
		con.close();

		return mapIPRange;
	}
	
	public static Map<String,Map<String, RangeIPModel>> getAllRangeIpOfMapLevel1(int idMap) throws SQLException
	{
		Map<String,Map<String, RangeIPModel>> map = new HashMap<String, Map<String,RangeIPModel>>();
		
		Connection con = DatabaseUtils.returnConnectivityMapConnection();
		String sql = "SELECT * FROM location_rangeip WHERE Code IN (SELECT Code FROM location_rangeip WHERE Id IN (SELECT IdRangeIp FROM map_coordinate WHERE IdMap = "+idMap+")) OR ParentCode IN (SELECT Code FROM location_rangeip WHERE Id IN (SELECT IdRangeIp FROM map_coordinate WHERE IdMap = "+idMap+")) ORDER BY ParentCode";
		System.out.println(sql);
		ResultSet rs = con.createStatement().executeQuery(sql);
		
		while(rs.next())
		{
			String rangeIp = rs.getString("RangeIp")!=null?rs.getString("RangeIp").trim().replaceAll("\\s+", " "):null;
			String code = rs.getString("Code");
			String parentCode = rs.getString("ParentCode");

			RangeIPModel model = new RangeIPModel();

			model.setId(rs.getInt("Id"));
			model.setCode(code);
			model.setParentCode(parentCode);
			model.setName(rs.getNString("Name"));

			if(rangeIp!=null && rangeIp.length()>0)
			{
				model.setListRangeIp(rangeIp);
			}

			if(!map.containsKey(code) && parentCode==null)
			{
				Map<String, RangeIPModel> mapSubRange = new HashMap<String, RangeIPModel>();

				mapSubRange.put(code, model);
				map.put(code, mapSubRange);
			}
			else
			{
				map.get(parentCode).put(code, model);
			}
		}
		
		rs.close();
		con.close();
		
		return map;
	}
}
