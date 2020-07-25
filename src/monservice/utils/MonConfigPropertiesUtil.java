package monservice.utils;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

public class MonConfigPropertiesUtil {
	private static Properties prop=new Properties();
	private static ConfigPropertiesUtil configProperties = new ConfigPropertiesUtil();
	private static String fileName=configProperties.getProperty("prop.url.monconfig");

	static {
		try {
			System.out.println(fileName);
			InputStream inputStream = new FileInputStream(fileName);
			prop.load(inputStream);
			inputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static String getProperty(String key){
		return prop.getProperty(key);
	}
}
