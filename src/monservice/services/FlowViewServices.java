package monservice.services;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.net.util.SubnetUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.maxmind.geoip2.DatabaseReader;

import monservice.models.FlowViewBean;
import monservice.models.FlowViewItemBean;
import monservice.models.GeneralDualStringBean;
import monservice.utils.ConfigPropertiesUtil;
import monservice.utils.FlowViewServiceUtils;

@Path("/flowview")
public class FlowViewServices {
	private FlowViewServiceUtils svFlowView = new FlowViewServiceUtils();
	
	private DocumentBuilderFactory factory;
	private DocumentBuilder builder;
	private Document document;
	private static ConfigPropertiesUtil configProperties = new ConfigPropertiesUtil();
	private String basePath = configProperties.getProperty("xml.url.floweventconfig");

	public FlowViewServices() {
		try {
			factory = DocumentBuilderFactory.newInstance();
			builder = factory.newDocumentBuilder();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Path("/getviewlist")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getViewList(@QueryParam("limit") int limit) {
		try {
			document = builder.parse(new File(basePath));
		} catch (SAXException | IOException e1) {
			e1.printStackTrace();
		}
		
		FlowViewBean modelFlowView = new FlowViewBean();
		List<GeneralDualStringBean> listConfig = new ArrayList<GeneralDualStringBean>();
		List<FlowViewItemBean> listFlowViewItem = new ArrayList<FlowViewItemBean>();
		
		NodeList listNodeIp = document.getElementsByTagName("ip");
		String conditionDesIp = "(";
		String conditionSrcIp = "(";

		for (int i = 0; i < listNodeIp.getLength();i++) {
			Node node = listNodeIp.item(i);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				Element element = (Element) node;
				String valueIp = element.getElementsByTagName("value").item(0).getTextContent();
				String alias = element.getElementsByTagName("name").item(0).getTextContent();

				GeneralDualStringBean modelConfig = new GeneralDualStringBean();
				modelConfig.setName(alias);
				modelConfig.setValue(valueIp);
				listConfig.add(modelConfig);
				
				if(valueIp.indexOf("/")!=-1)
				{
					SubnetUtils util = new SubnetUtils(valueIp);
					System.out.println(valueIp+"--"+util.getInfo().getLowAddress()+"--"+util.getInfo().getHighAddress());
					conditionDesIp += "(ip_dst >= INET_ATON('"+util.getInfo().getLowAddress()+"') AND ip_dst <= INET_ATON('"+util.getInfo().getHighAddress()+"')) OR";
					conditionSrcIp += "(ip_src >= INET_ATON('"+util.getInfo().getLowAddress()+"') AND ip_src <= INET_ATON('"+util.getInfo().getHighAddress()+"')) OR";
				}
				else
				{
					System.out.println(valueIp);
					conditionDesIp += "(ip_dst = INET_ATON('"+valueIp+"')) OR";
					conditionSrcIp += "(ip_src = INET_ATON('"+valueIp+"')) OR";
				}
			}
		}
		
		conditionDesIp = conditionDesIp.substring(0,conditionDesIp.length()-2)+")";
		conditionSrcIp = conditionSrcIp.substring(0,conditionSrcIp.length()-2)+")";
		
		try {
			listFlowViewItem = svFlowView.getEventList(conditionDesIp, conditionSrcIp,limit);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		modelFlowView.setConfigs(listConfig);
		modelFlowView.setItems(listFlowViewItem);

		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
				.entity(modelFlowView)
				.build();
	}
	
	@Path("/setitemstatus")
	@POST
	@Produces({MediaType.APPLICATION_JSON })
	public Response setItemStatus(@QueryParam("id") int idItem,@QueryParam("status") int status) {
		String result = "success";
		
		try {
			svFlowView.updateCheckEvent(idItem, status);
		} catch (SQLException e) {
			e.printStackTrace();
			result="fail";
		}
		
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
				.entity("{\"result\": \""+result+"\"}")
				.build();
	}
}
