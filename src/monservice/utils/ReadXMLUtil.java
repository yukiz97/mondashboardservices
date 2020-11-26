package monservice.utils;

import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;

public class ReadXMLUtil {
	DocumentBuilderFactory factory;
	DocumentBuilder builder;
	Document document;
	
	TransformerFactory transformerFactory;
	Transformer transformer;
	
	String basePath;

	public ReadXMLUtil(String basePath) {
		try {
			factory = DocumentBuilderFactory.newInstance();
			builder = factory.newDocumentBuilder();
			
			transformerFactory = TransformerFactory.newInstance();
			transformer = transformerFactory.newTransformer();
			
			this.basePath = basePath;
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void readXML() throws Exception
	{
		File fileXML = new File(basePath);
		if(fileXML.exists())
		{
			document = builder.parse(new File(basePath));
		}
		else
		{
			System.out.println("XML file doesn't exist!");
		}
	}
	
	public void saveXML() throws Exception
	{
		DOMSource source = new DOMSource(document);
		StreamResult result = new StreamResult(new File(basePath));
		transformer.transform(source, result);
	}

	public Document getDocument() {
		return document;
	}
	public void setDocument(Document document) {
		this.document = document;
	}
}
