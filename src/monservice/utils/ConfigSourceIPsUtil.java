package monservice.utils;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class ConfigSourceIPsUtil {

	public static void write(JSONArray jsonArray) {
		try (FileWriter file = new FileWriter(MonConfigPropertiesUtil.getProperty("nagiosconfig.basepath.conf")+"firewall_ips.json")) {
            file.write(jsonArray.toJSONString()); 
            file.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
	}
	
	public static JSONArray read() {
		JSONArray jsonArray=new JSONArray();
		JSONParser jsonParser = new JSONParser();
		try (FileReader reader = new FileReader(MonConfigPropertiesUtil.getProperty("nagiosconfig.basepath.conf")+"firewall_ips.json"))
        {
            Object obj = jsonParser.parse(reader);
            jsonArray = (JSONArray) obj;
            System.out.println(jsonArray);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
		return jsonArray;
	}
	
	public static List<String> getListIPs(){
		List<String> ips=new ArrayList<>();
		JSONArray array = ConfigSourceIPsUtil.read();
		for (Object object : array) {
			JSONObject json=(JSONObject) object;
			ips.add(json.get("ip").toString());
		}
		return ips;
	}
	
	public static boolean delete(String id) {
		try {
			JSONArray array=read();
			for (Object object : array) {
				JSONObject jsonObject=(JSONObject) object;
				if(jsonObject.get("id").equals(id)) {
					array.remove(object);
					write(array);
					return true;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	@SuppressWarnings("unchecked")
	public static boolean update(String id, String ip) {
		try {
			JSONArray array=read();
			for (Object object : array) {
				JSONObject jsonObject=(JSONObject) object;
				if(jsonObject.get("id").equals(id)) {
					jsonObject.put("ip", ip);
					write(array);
					return true;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	@SuppressWarnings("unchecked")
	public static boolean add(String ip) {
		try {
			JSONArray array=read();
			JSONObject item = new JSONObject();
			item.put("id", UUID.randomUUID().toString());
	        item.put("ip", ip);
	        array.add(item);
	        
	        write(array);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
}
