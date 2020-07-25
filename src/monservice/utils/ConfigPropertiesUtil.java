package monservice.utils;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

public class ConfigPropertiesUtil{
	private static Properties prop=new Properties();
	private static String fileName="config.properties";

	public ConfigPropertiesUtil() {
		try {
			InputStream inputStream=getClass().getClassLoader().getResourceAsStream(fileName);
			prop.load(inputStream);
			inputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public String getProperty(String key){
		return prop.getProperty(key);
	}
}
