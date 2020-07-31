package monservice.utils;

import java.util.ArrayList;
import java.util.List;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;

public class SnortMongoDBServiceUtils {
	public static List<String> getDistinctSigName(){
		List<String> listSigName = new ArrayList<String>();
		String mongoHost = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.host");
		String mongoPort = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.port");
		
		MongoClient mongoClient = new MongoClient(new MongoClientURI("mongodb://"+mongoHost+":"+mongoPort));
		MongoDatabase mongoDatabase=mongoClient.getDatabase("syslog");
		
		MongoCursor<String> cursor = mongoDatabase.getCollection("snort").distinct("sig_name", String.class).iterator();
		
		while(cursor.hasNext()) {
			listSigName.add(cursor.next());
		}
		mongoClient.close();
		
		return listSigName;
	}
	
	public static List<String> getDistinctClassification(){
		List<String> listClassification = new ArrayList<String>();
		String mongoHost = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.host");
		String mongoPort = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.port");
		
		MongoClient mongoClient = new MongoClient(new MongoClientURI("mongodb://"+mongoHost+":"+mongoPort));
		MongoDatabase mongoDatabase=mongoClient.getDatabase("syslog");
		
		MongoCursor<String> cursor = mongoDatabase.getCollection("snort").distinct("classification", String.class).iterator();
		
		while(cursor.hasNext()) {
			listClassification.add(cursor.next());
		}
		mongoClient.close();
		
		return listClassification;
	}
}
