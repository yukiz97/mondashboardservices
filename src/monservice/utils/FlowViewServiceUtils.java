package monservice.utils;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import monservice.models.FlowViewItemBean;

public class FlowViewServiceUtils {
	public List<FlowViewItemBean> getEventList(String conditionDes,String conditionSrc,int limit) throws SQLException
	{
		List<FlowViewItemBean> list = new ArrayList<FlowViewItemBean>();
		Connection con = DatabaseUtils.returnSnortMySQLConnection();
		String sql = "SELECT id,inet_ntoa(ip_src) AS sourceip,inet_ntoa(ip_dst) AS destinationip,port_dst,sig_priority,sig_name,`check` FROM event_alert_map WHERE 1 = 1 AND ("+conditionDes+" OR "+conditionSrc+") ORDER BY id DESC limit 0,"+limit;
		System.out.println(sql);
		ResultSet rs = con.createStatement().executeQuery(sql);
		
		while(rs.next())
		{
			FlowViewItemBean model = new FlowViewItemBean();
			
			String sourceIP = rs.getString("sourceip");
			String desIp = rs.getString("destinationip");
			
			model.setSourceCode(GeneralFunctionUtils.getCodeOnIp(sourceIP));
			model.setSourceIp(sourceIP);
			model.setDesCode(GeneralFunctionUtils.getCodeOnIp(desIp));
			model.setDesIp(desIp);
			model.setSeverity(rs.getInt("sig_priority"));
			model.setSignature(rs.getString("sig_name"));
			model.setPort(rs.getInt("port_dst"));
			model.setCheck(rs.getInt("check"));
			model.setId(rs.getInt("id"));
			
			list.add(model);
		}
		rs.close();
		con.close();
		
		return list;
	}
	
	public void updateCheckEvent(int id,int value) throws SQLException
	{
		Connection con = DatabaseUtils.returnSnortMySQLConnection();
		String sql = "UPDATE event_alert_map SET `check` = "+value+" WHERE id = "+id;
		con.createStatement().executeUpdate(sql);
		
		con.close();
	}
}
