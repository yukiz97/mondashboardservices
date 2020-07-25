package monservice.utils;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseUtils {
	public static Connection returnNagiosMySQLConnection()
	{
		Connection con = null;
		try {
			String driver = MonConfigPropertiesUtil.getProperty("jdbc.default.driverClassName");
			String user = MonConfigPropertiesUtil.getProperty("jdbc.default.username");
			String password = MonConfigPropertiesUtil.getProperty("jdbc.default.password");
			String url = MonConfigPropertiesUtil.getProperty("jdbc.default.server.url");
			
			Class.forName(driver);
			con = DriverManager.getConnection(url, user, password);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return con;
	}
	
	public static Connection returnSnortMySQLConnection()
	{
		Connection con = null;
		try {
			String driver = MonConfigPropertiesUtil.getProperty("jdbc.snort.driverClassName");
			String user = MonConfigPropertiesUtil.getProperty("jdbc.snort.username");
			String password = MonConfigPropertiesUtil.getProperty("jdbc.snort.password");
			String url = MonConfigPropertiesUtil.getProperty("jdbc.snort.server.url");
			
			Class.forName(driver);
			con = DriverManager.getConnection(url, user, password);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return con;
	}
	
	public static Connection returnConnectivityMapConnection()
	{
		Connection con = null;
		try {
			String driver = MonConfigPropertiesUtil.getProperty("jdbc.conmap.driverClassName");
			String user = MonConfigPropertiesUtil.getProperty("jdbc.conmap.username");
			String password = MonConfigPropertiesUtil.getProperty("jdbc.conmap.password");
			String url = MonConfigPropertiesUtil.getProperty("jdbc.conmap.server.url");
			System.out.println(user);
			Class.forName(driver);
			con = DriverManager.getConnection(url, user, password);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return con;
	}
}
