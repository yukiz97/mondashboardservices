package monservice.utils;

import java.io.File;

import org.apache.commons.lang3.SystemUtils;

public class MonUtil {
	public String getFolderLogsXml(){
		String path="";
		if(SystemUtils.IS_OS_WINDOWS){
			if(MonConfigPropertiesUtil.getProperty("logs.xml.folder.window").isEmpty()) {
				File file=new File(getClass().getClassLoader().getResource("").getFile());
				path=file.getPath()+File.separator;
			}else
				path=MonConfigPropertiesUtil.getProperty("logs.xml.folder.window");
		}else{
			path=MonConfigPropertiesUtil.getProperty("logs.xml.folder.linux");
		}
		System.out.println("Path: "+path);
		return path;
	}
}
