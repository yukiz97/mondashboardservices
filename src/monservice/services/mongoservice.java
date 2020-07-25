package monservice.services;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoDatabase;

import monservice.utils.MonConfigPropertiesUtil;

public class mongoservice implements ServletContextListener{
	private static String mongoHost = null;
	private static String mongoPort = null;
	private static MongoClient mongoClient = null;
	public static MongoDatabase mongoDatabase=null;
	
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		 mongoClient.close(); 
		 System.out.println("Stop mongodb.....ok");
	}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		mongoHost = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.host"); 
		mongoPort =MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.port"); 
		mongoClient = new MongoClient(new MongoClientURI("mongodb://"+mongoHost+":"+mongoPort));
		mongoDatabase=mongoClient.getDatabase("syslog");
		System.out.println("Start mongodb.....ok");
	}
}
