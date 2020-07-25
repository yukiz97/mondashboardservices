package monservice.utils;

import java.io.File;
import java.net.InetAddress;

import monservice.models.GeneralDualStringBean;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import com.maxmind.geoip2.record.Country;

public class GeneralFunctionUtils {

	private static File database;
	private static DatabaseReader reader = null;

	static{
		try {
			database = new File("/opt/dev/apps/data/GeoLite2-City.mmdb");
			reader = new DatabaseReader.Builder(database).build();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static GeneralDualStringBean getCodeOnIp(String ip) {
		GeneralDualStringBean model = new GeneralDualStringBean();

		String code = "UKN", name = "Unknow";
		try {
			InetAddress ipAddress = InetAddress.getByName(ip);
			CityResponse response = reader.city(ipAddress);
			Country country = response.getCountry();
			name = country.getName();
			code = country.getIsoCode();  

		} catch (Exception e) {
			code = "ukn"; name = "Unknow";
		}
		if(code == null) {
			code = "ukn"; name = "Unknow";
		}

		model.setName(name);
		model.setValue(code.toLowerCase());

		return model;
	}
}
