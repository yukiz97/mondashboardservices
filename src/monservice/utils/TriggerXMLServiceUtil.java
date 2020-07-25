package monservice.utils;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import monservice.models.HostBean;
import monservice.models.HostTriggerBean;
import monservice.models.TriggerBean;

import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;


public class TriggerXMLServiceUtil {
	private static DocumentBuilderFactory factory;
	private static DocumentBuilder builder;
	private static TransformerFactory transformerFactory;
	private static Transformer transformer;
	@SuppressWarnings("unused")
	private static DOMSource source;
	@SuppressWarnings("unused")
	private static StreamResult result;
	private static XPath xpath = XPathFactory.newInstance().newXPath();
	@SuppressWarnings("unused")
	private static Element eleRoot;
	private static Document document;
	private static MonUtil monUtil=new MonUtil();
	
	static{
		try {
			TriggerXMLServiceUtil.readXML();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static HashMap<String, HostTriggerBean> getHostTriggerList(){
		HashMap<String, HostTriggerBean> result=new HashMap<String, HostTriggerBean>();
		
		/*Láº¥y danh sĂ¡ch cĂ¡i tháº» host*/
		NodeList listNodeHost = document.getElementsByTagName("host");
		/*Láº·p danh sĂ¡ch cĂ¡c tháº» host*/
		for (int h = 0; h < listNodeHost.getLength();h++) {
			Element elementHost = (Element) listNodeHost.item(h);
			String host=elementHost.getAttribute("id");
			String hostname=elementHost.getAttribute("hostname");
			
			if(result.containsKey(host)==false){
				HostBean hostBean=new HostBean();
				hostBean.setSourceip(host);
				hostBean.setHostname(hostname);
				
				HostTriggerBean hostTriggerBean=new HostTriggerBean();
				hostTriggerBean.setHostBean(hostBean);
				
				result.put(host, hostTriggerBean);
			}
			
			NodeList listNodeTrigger = elementHost.getElementsByTagName("trigger");
			for (int i = 0; i < listNodeTrigger.getLength();i++) {
				Node node = listNodeTrigger.item(i);
				if (node.getNodeType() == Node.ELEMENT_NODE) {
					try {
						Element elementTrigger = (Element) node;

						String id = elementTrigger.getAttribute("id");
						String program = elementTrigger.getAttribute("program");
						String description = elementTrigger.getAttribute("description");
						String date = elementTrigger.getAttribute("date");
						String facility=elementTrigger.getAttribute("facility");
						String severity=elementTrigger.getAttribute("severity");
						String priority=elementTrigger.getAttribute("priority");
						
						String keysearch_01 = elementTrigger.getElementsByTagName("keyword_01").item(0).getTextContent();
						String keysearch_02 = elementTrigger.getElementsByTagName("keyword_02").item(0).getTextContent();
						String keysearch_03 = elementTrigger.getElementsByTagName("keyword_03").item(0).getTextContent();
						String keysearch_04 = elementTrigger.getElementsByTagName("keyword_04").item(0).getTextContent();
						String keysearch_05 = elementTrigger.getElementsByTagName("keyword_05").item(0).getTextContent();
						
						TriggerBean model = new TriggerBean();
						model.setId(id);
						model.setProgram(program);
						model.setDescription(description);
						model.setDateCreate(date);
						model.setFacility(facility);
						model.setSeverity(severity);
						model.setHost(host);
						model.setAlias(hostname);
						model.setPriority(priority);
						model.setKeysearch_01(keysearch_01);
						model.setKeysearch_02(keysearch_02);
						model.setKeysearch_03(keysearch_03);
						model.setKeysearch_04(keysearch_04);
						model.setKeysearch_05(keysearch_05);
						
						/* Chá»‰ láº¥y trigger gáº¯n mark High */
						if(result.containsKey(host) && model.getPriority().equals("1")){
							result.get(host).getTriggerBean().add(model);
						}
					} catch (DOMException e) {
						e.printStackTrace();
					}
				}
			}
		}
		return result;
	}
	
	public static List<TriggerBean> getTriggerList(){
		List<TriggerBean> result=new ArrayList<TriggerBean>();
		getHostTriggerList().forEach((host, hostTriggerBean)->{
			result.addAll(hostTriggerBean.getTriggerBean());
		});
		return result;
	}
	

	public static boolean containHost(String host) throws XPathExpressionException{
		Node check = (Node) xpath.evaluate("//host[@id='"+host+"']", document,XPathConstants.NODE);
		return check!=null?true:false;
	}
	
	public static boolean isElementExist(String id) throws XPathExpressionException{
		Node check = (Node) xpath.evaluate("//trigger[@id='"+id+"']", document,XPathConstants.NODE);
		return check!=null?true:false;
	}

	private static void readXML() throws Exception{
		String fileTrigger=monUtil.getFolderLogsXml()+"trigger.xml";
		
		factory = DocumentBuilderFactory.newInstance();
		builder = factory.newDocumentBuilder();
		document = builder.parse(new File(fileTrigger));

		eleRoot = document.getDocumentElement();

		transformerFactory = TransformerFactory.newInstance();
		transformer = transformerFactory.newTransformer();
		result = new StreamResult(new File(fileTrigger));

		transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		transformer.setOutputProperty(OutputKeys.DOCTYPE_PUBLIC,"yes");
		transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "3");
	}

}
