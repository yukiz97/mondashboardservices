package monservice.services;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.gte;
import static com.mongodb.client.model.Filters.lte;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.regex.Pattern;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import monservice.models.BanCheoCheoModel;
import monservice.models.GeneralDualStringBean;
import monservice.models.RangeIPModel;
import monservice.models.StartDateEndDateModel;
import monservice.models.WindowLogModel;
import monservice.utils.CheckIpInIpRange;
import monservice.utils.DynamicMapServiceUtils;
import monservice.utils.MonConfigPropertiesUtil;

import org.apache.commons.lang3.SystemUtils;
import org.apache.commons.validator.routines.InetAddressValidator;
import org.bson.Document;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.exception.GeoIp2Exception;
import com.maxmind.geoip2.model.CityResponse;
import com.maxmind.geoip2.record.Country;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

@Path("/camservice")
public class camservice {
	SimpleDateFormat sdfDatetime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	Map<String,Map<String, RangeIPModel>> mapRangeIpLv2 = new HashMap<String, Map<String,RangeIPModel>>();
	Set<String> listCheck = new HashSet<>();
	Map<String, GeneralDualStringBean> mapIpCode = new HashMap<String, GeneralDualStringBean>();
	InetAddress ipAddress;
	@Path("/getdata_snort")
	@POST
	@Produces({MediaType.APPLICATION_JSON })
	public Response getData(@QueryParam("fromDate")String fromDate,@QueryParam("toDate")String toDate,@QueryParam("leftCode")String leftCode,@QueryParam("rightCode")String rightCode) {
		List<BanCheoCheoModel> lst = new ArrayList<BanCheoCheoModel>();
		try {
			String[] leftArray = leftCode.split(Pattern.quote(" "));
			String[] rightArray = rightCode.split(Pattern.quote(" "));

			String finalLeftCode = leftArray[0];
			String finalLeftId = leftArray[1];

			String finalRightCode = rightArray[0];
			String finalRightId = rightArray[1];

			if(finalLeftCode.equals("level-1"))
			{
				mapRangeIpLv2.putAll(DynamicMapServiceUtils.getAllRangeIpOfMapLevel1(Integer.parseInt(finalLeftId)));
			}
			else
			{
				listCheck.add(finalLeftCode);
				System.out.println("left");
				mapRangeIpLv2.put(finalLeftCode, DynamicMapServiceUtils.getAllRangeIpOfParent(finalLeftCode));
			}

			if(finalRightCode.equals("level-1"))
			{
				mapRangeIpLv2.putAll(DynamicMapServiceUtils.getAllRangeIpOfMapLevel1(Integer.parseInt(finalRightId)));
			}
			else
			{
				listCheck.add(finalRightCode);
				System.out.println("right");
				mapRangeIpLv2.put(finalRightCode, DynamicMapServiceUtils.getAllRangeIpOfParent(finalRightCode));
			}

			String mongoHost = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.host");
			String mongoPort = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.port");
			MongoClient mongoClient = new MongoClient(new MongoClientURI("mongodb://"+mongoHost+":"+mongoPort));
			MongoDatabase mongoDatabase=mongoClient.getDatabase("syslog");
			FindIterable<Document> result = null;
			result = mongoDatabase.getCollection("snort").find(and(gte("DATE",sdfDatetime.parse(fromDate)),lte("DATE",sdfDatetime.parse(toDate))));
			for (Document document : result) {
				String srcIp = document.getString("src_ip");
				String dstIp = document.getString("dst_ip");

				GeneralDualStringBean modelSrc = null;
				GeneralDualStringBean modelDst = null;


				if(mapIpCode.containsKey(srcIp)) 
					modelSrc = mapIpCode.get(srcIp);
				else {
					modelSrc = returnCodeOfIpGeneral(srcIp, finalLeftCode, finalRightCode);

					if(modelSrc!=null) mapIpCode.put(srcIp, modelSrc); }

				if(mapIpCode.containsKey(dstIp))
					modelDst = mapIpCode.get(dstIp);
				else
				{
					modelDst = returnCodeOfIpGeneral(dstIp, finalLeftCode, finalRightCode);

					if(modelDst!=null)
						mapIpCode.put(dstIp, modelDst);
				}

				if(modelSrc==null || modelDst==null)
					continue;

				BanCheoCheoModel model=new BanCheoCheoModel();
				model.setSrc_port(document.getString("src_port"));
				model.setSrc_ip(srcIp);
				model.setSig_rev(document.getString("sig_rev"));
				model.setSig_name(document.getString("sig_name"));
				model.setSig_id(document.getString("sig_id"));
				model.setProtocol(document.getString("protocol"));
				model.setPriority(document.getString("priority"));
				model.setGen_id(document.getString("gen_id"));
				model.setDst_port(document.getString("dst_port"));
				model.setDst_ip(dstIp);
				model.setClassification(document.getString("classification"));
				model.setSOURCEIP(document.getString("SOURCEIP"));
				model.setDATE(document.getDate("DATE"));
				model.setFrom(modelSrc.getName());
				model.setFromName(modelSrc.getValue());
				model.setTo(modelDst.getName());
				model.setToName(modelDst.getValue());
				model.setId(model.getFrom()+"_"+model.getTo());
				lst.add(model);

			}
			mongoClient.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("END------------------");
		return Response.status(201).header("Access-Control-Allow-Origin", "*").entity(lst).build();
	}

	@Path("/getdata_connectivity")
	@POST
	@Produces({MediaType.APPLICATION_JSON })
	public Response getDataConnectivitiesURLPARAM(@QueryParam("fromDate")String fromDate,@QueryParam("toDate")String toDate,@QueryParam("leftCode")String leftCode,@QueryParam("rightCode")String rightCode) {
		List<BanCheoCheoModel> lst = new ArrayList<BanCheoCheoModel>();
		try {
			String[] leftArray = leftCode.split(Pattern.quote(" "));
			String[] rightArray = rightCode.split(Pattern.quote(" "));

			String finalLeftCode = leftArray[0];
			String finalLeftId = leftArray[1];

			String finalRightCode = rightArray[0];
			String finalRightId = rightArray[1];

			if(finalLeftCode.equals("level-1"))
			{
				mapRangeIpLv2.putAll(DynamicMapServiceUtils.getAllRangeIpOfMapLevel1(Integer.parseInt(finalLeftId)));
			}
			else
			{
				listCheck.add(finalLeftCode);
				System.out.println("left");
				mapRangeIpLv2.put(finalLeftCode, DynamicMapServiceUtils.getAllRangeIpOfParent(finalLeftCode));
			}

			if(finalRightCode.equals("level-1"))
			{
				mapRangeIpLv2.putAll(DynamicMapServiceUtils.getAllRangeIpOfMapLevel1(Integer.parseInt(finalRightId)));
			}
			else
			{
				listCheck.add(finalRightCode);
				System.out.println("right");
				mapRangeIpLv2.put(finalRightCode, DynamicMapServiceUtils.getAllRangeIpOfParent(finalRightCode));
			}

			System.out.println("do getdata from connectivities-------");
			String mongoHost = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.host");
			String mongoPort = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.port");
			MongoClient mongoClient = null;
			mongoClient = new MongoClient(new MongoClientURI("mongodb://"+mongoHost+":"+mongoPort));
			MongoDatabase mongoDatabase=mongoClient.getDatabase("syslog");
			MongoCollection<Document> collection = mongoDatabase.getCollection("connectivities");
			FindIterable<Document> result = null;
			result = collection.find(and(gte("DATE",sdfDatetime.parse(fromDate)),lte("DATE",sdfDatetime.parse(toDate))));
			for (Document document : result) {
				String srcIp = document.getString("src_ip");
				String dstIp = document.getString("dst_ip");

				GeneralDualStringBean modelSrc = null;
				GeneralDualStringBean modelDst = null;

				if(mapIpCode.containsKey(srcIp))
					modelSrc = mapIpCode.get(srcIp);
				else
				{
					modelSrc = returnCodeOfIpGeneral(srcIp, finalLeftCode, finalRightCode);

					if(modelSrc!=null)
						mapIpCode.put(srcIp, modelSrc);
				}
				if(mapIpCode.containsKey(dstIp))
					modelDst = mapIpCode.get(dstIp);
				else
				{
					modelDst = returnCodeOfIpGeneral(dstIp, finalLeftCode, finalRightCode);

					if(modelDst!=null)
						mapIpCode.put(dstIp, modelDst);
				}

				if(modelSrc==null || modelDst==null)
					continue;

				BanCheoCheoModel model=new BanCheoCheoModel();
				model.setSrc_ip(srcIp);
				model.setSrc_port(document.getString("src_port"));
				model.setDst_ip(dstIp);
				model.setDst_port(document.getString("dst_port"));
				model.setSOURCEIP(document.getString("SOURCEIP"));
				model.setDATE(document.getDate("DATE"));
				model.setAction(document.getString("action"));
				model.setProtocol(document.getString("protocol"));
				model.setFrom(modelSrc.getName());
				model.setFromName(modelSrc.getValue());
				model.setTo(modelDst.getName());
				model.setToName(modelDst.getValue());

				model.setId(model.getFrom()+"_"+model.getTo());
				lst.add(model);
			}
			mongoClient.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("End---------------------");
		return Response.status(201).header("Access-Control-Allow-Origin", "*").entity(lst).build();
	}
	/*@Path("/getdata_connectivity")
	@POST
	@Produces({MediaType.APPLICATION_JSON })
	public Response getDataConnectivitiesURLPARAM(@QueryParam("fromDate")String fromDate,@QueryParam("toDate")String toDate) {
		System.out.println("do getdata from connectivities-------");
		String mongoHost = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.host");
		String mongoPort = MonConfigPropertiesUtil.getProperty("jdbc.mongodb.logs.port");
		List<BanCheoCheoModel> lst = new ArrayList<BanCheoCheoModel>();
		MongoClient mongoClient = null;
		mongoClient = new MongoClient(new MongoClientURI("mongodb://"+mongoHost+":"+mongoPort));
		MongoDatabase mongoDatabase=mongoClient.getDatabase("syslog");
		MongoCollection<Document> collection = mongoDatabase.getCollection("connectivities");
		FindIterable<Document> result = null;
		try {
			result = collection.find(and(gte("DATE",sdfDatetime.parse(fromDate)),lte("DATE",sdfDatetime.parse(toDate))));
		} catch (ParseException e2) {
			e2.printStackTrace();
		}
		for (Document document : result) {
			BanCheoCheoModel model=new BanCheoCheoModel();
			model.setSrc_ip(document.getString("src_ip"));
			model.setDst_ip(document.getString("dst_ip"));
			model.setSOURCEIP(document.getString("SOURCEIP"));
			model.setDATE(document.getDate("DATE"));
			model.setAction(document.getString("action"));

			System.out.println(document.getString("dst_ip")+"-------");


			String fromCode="", toCode ="", fromName = "", toName= "";
			InetAddress ipAddress;
			System.out.println(model.getSrc_ip()+" - "+model.getDst_ip());
			if(isPrivateIp(model.getSrc_ip())) {
				model.setFrom(model.getSrc_ip());
			}else {

				try {
					ipAddress = InetAddress.getByName(model.getSrc_ip());
					CityResponse response = reader.city(ipAddress);
					Country country = response.getCountry();
					fromCode = country.getIsoCode();  
					fromName = country.getName();
					model.setFrom(fromCode);
					model.setFromName(fromName);
				} catch (Exception e) {
					// TODO Auto-generated catch block
//					e.printStackTrace();
					continue;
				}
			}

			if(isPrivateIp(model.getDst_ip())) {
				model.setTo(model.getDst_ip());
			}else {
				try {
					ipAddress = InetAddress.getByName(model.getDst_ip());
					CityResponse response = reader.city(ipAddress);
					Country country = response.getCountry();
					toCode = country.getIsoCode();  
					toName = country.getName();
					model.setTo(toCode);
					model.setToName(toName);
				} catch (Exception e1) {
					// TODO Auto-generated catch block
//					e1.printStackTrace();
					continue;
				}

			}
			if(model.getFrom() == null || model.getTo() == null) {
				continue;
			}

			model.setId(model.getFrom()+"_"+model.getTo());
			lst.add(model);
		}
		mongoClient.close();
		return Response.status(201).header("Access-Control-Allow-Origin", "*").entity(lst).build();
	}*/

	public GeneralDualStringBean returnCodeOfIpGeneral(String ip,String leftCode,String rightCode)
	{
		String srcCode = null;
		String srcName = null;

		if(!InetAddressValidator.getInstance().isValidInet4Address(ip))
			return null;
		GeneralDualStringBean model = returnCodeOfIp(ip, leftCode, rightCode);

		if(model!=null)
		{
			srcCode = model.getName();
			srcName = model.getValue();
		}
		else
		{
			try {
				ipAddress = InetAddress.getByName(ip);
				CityResponse response = reader.city(ipAddress);

				Country country = response.getCountry();

				srcCode = country.getIsoCode();

				if(srcCode!=null)
					srcName = country.getName();
			} catch (IOException | GeoIp2Exception e) {
				return null;
			}
		}

		if(srcCode!=null)
		{
			model = new GeneralDualStringBean();
			model.setName(srcCode);
			model.setValue(srcName);
		}

		return model;
	}

	public GeneralDualStringBean returnCodeOfIp(String ip,String code1,String code2)
	{
		GeneralDualStringBean model1 = returnCodeOfIp(ip,code1);

		if(model1!=null)
			return model1;

		GeneralDualStringBean model2 = returnCodeOfIp(ip,code2);
		if(model2!=null)
			return model2;

		return null;
	}

	public GeneralDualStringBean returnCodeOfIp(String ip,String code)
	{
		GeneralDualStringBean model = null;

		if(code.equals("level-1"))
		{
			for (Entry<String, Map<String, RangeIPModel>> entry : mapRangeIpLv2.entrySet()) {
				if(listCheck.contains(String.valueOf(entry.getKey())))
					continue;
				model = test(entry.getValue(), ip, entry.getKey());

				if(model!=null)
				{
					return model;
				}
			}
		}
		else
		{
			model = test(mapRangeIpLv2.get(code),ip,null);
		}

		return model;
	}

	private GeneralDualStringBean test(Map<String, RangeIPModel> map,String ip,String codeParent)
	{
		GeneralDualStringBean model;
		for (Entry<String, RangeIPModel> entry : map.entrySet()) {
			for(String ipRange : entry.getValue().getListRangeIp())
			{
				ipRange = ipRange.trim();
				if(ipRange.indexOf("/")==-1){
					if(ipRange.equals(ip))
					{
						model = new GeneralDualStringBean();
						if(codeParent!=null)
							model.setName(codeParent);
						else
							model.setName(entry.getValue().getCode());
						System.out.println(model.getName()+"=-=="+codeParent);

						model.setValue(entry.getValue().getName());

						return model;
					}
				}
				else
				{
					CheckIpInIpRange checkIp = new CheckIpInIpRange(ipRange);

					if(checkIp.matches(ip))
					{
						model = new GeneralDualStringBean();

						if(codeParent!=null)
							model.setName(codeParent);
						else
							model.setName(entry.getValue().getCode());

						model.setValue(entry.getValue().getName());

						return model;
					}
				}
			}
		}

		return null;
	}

	private File database; 
	private DatabaseReader reader = null;

	public camservice() {
		super();
		try {
			System.out.println("initialize maxmin");
			if(SystemUtils.IS_OS_WINDOWS) {
				database = new File(getClass().getClassLoader().getResource("GeoLite2-City.mmdb").getFile());
			} else
			{
				database = new File("/opt/dev/apps/data/GeoLite2-City.mmdb"); 
			}
			reader = new DatabaseReader.Builder(database).build();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private boolean isPrivateIp(String ip) {
		boolean result = false;
		try {
			int tmp1 = Integer.valueOf(ip.split("\\.")[0]);
			int tmp2 = Integer.valueOf(ip.split("\\.")[1]);
			if(tmp1 == 127)
				return true;

			if(tmp1 == 10) {
				return true;
			}else if (tmp1 == 172 && tmp2 >=16 && tmp2 <= 31){
				return true;
			}else if(tmp1 == 192 && tmp2 == 168) {
				return true;
			}else {
				return false;
			}

		}catch(Exception e) {
			//			e.printStackTrace();
			return false;
		}
	}
}
