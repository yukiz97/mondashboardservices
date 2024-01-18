package monservice.models;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class MD5CheckingModel {
	public List<String> md5s;
}
