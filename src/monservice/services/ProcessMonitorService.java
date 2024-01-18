package monservice.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

import monservice.utils.MonConfigPropertiesUtil;

@Path("/processmonitor")
public class ProcessMonitorService {

	static String mongoHost = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.host");
	static String mongoPort = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.port");
	static MongoClient mongoClient = new MongoClient(new MongoClientURI("mongodb://"+mongoHost+":"+mongoPort));
	static MongoCollection<Document> mongoCollection = mongoClient.getDatabase("syslog").getCollection("md5vt");
	@Path("/checkmd5")
	@POST
	@Produces({MediaType.APPLICATION_JSON })
	public Response setItemStatus(List<String> listMD5) {
		Map<String, Integer> mapResult = new HashMap<String, Integer>();
		
		Document filter = new Document();
		filter.append("md5", new Document("$in",listMD5));
		
		FindIterable<Document> result = mongoCollection.find(filter);
		
		for (Document document : result) {
			mapResult.put(document.getString("md5"),document.getDouble("value").intValue());
		}
		
		for(String md5Input : listMD5) {
			if(!mapResult.containsKey(md5Input)) {
				mapResult.put(md5Input, -1);
			}
		}
		
		return Response.status(200)
				.header("Access-Control-Allow-Origin", "*")
				.entity(mapResult)
				.build();
	}
}
