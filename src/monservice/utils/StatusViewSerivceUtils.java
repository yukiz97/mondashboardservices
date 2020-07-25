package monservice.utils;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import monservice.models.StatusViewBean;

public class StatusViewSerivceUtils {
SimpleDateFormat sdfSQLDatetime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	public List<StatusViewBean> getStateChangeList(String type,int limit) throws SQLException
	{
		Connection con = DatabaseUtils.returnNagiosMySQLConnection();
		List<StatusViewBean> list = new ArrayList<StatusViewBean>();
		
		String sql = "SELECT statehistory_id,state_time,display_name,state,last_state,output,`check` FROM nagios_statehistory state,nagios_"+type+"s "+type+" WHERE state.object_id = "+type+"."+type+"_object_id AND ((state=last_state and state!=0) OR (state!=last_state)) ORDER BY state_time DESC LIMIT 0,"+limit;
		System.out.println(sql);
		ResultSet rs = con.createStatement().executeQuery(sql);
		while(rs.next())
		{
			StatusViewBean model = new StatusViewBean();
			
			model.setId(rs.getInt("statehistory_id"));
			model.setTimestamp(sdfSQLDatetime.format(rs.getTimestamp("state_time")));
			model.setName(rs.getString("display_name"));
			model.setCurrentState(rs.getInt("state"));
			model.setLastState(rs.getInt("last_state"));
			model.setOutput(rs.getString("output"));
			model.setCheck(rs.getInt("check"));
			
			list.add(model);
		}
		
		rs.close();
		con.close();
		
		return list;
	}
	
	public void updateStatusStateHistory(int id,int check) throws SQLException
	{
		Connection con = DatabaseUtils.returnNagiosMySQLConnection();
		String sql = "UPDATE nagios_statehistory SET `check` = "+check+" WHERE statehistory_id = "+id;
		con.createStatement().executeUpdate(sql);
		con.close();
	}
}
