package monservice.models;

import java.util.Date;

//@JsonInclude(JsonInclude.Include.NON_NULL)
public class BanCheoCheoModel {
	private Object _id;
	private String id;
	private String src_port;
	private String src_ip;
	private String sig_rev;
	private String sig_name;
	private String sig_id;
	private String protocol;
	private String priority;
	private String gen_id;
	private String dst_port;
	private String dst_ip;
	private String classification;
	private String SOURCEIP;
	private Date DATE;
	private String from;
	private String to;
	private String fromName;
	private String toName;
	private String action;
	
	private String codeLeft;
	private String codeRight;
	
	public Object get_id() {
		return _id;
	}
	public void set_id(Object _id) {
		this._id = _id;
	}
	public String getSrc_port() {
		return src_port;
	}
	public void setSrc_port(String src_port) {
		this.src_port = src_port;
	}
	public String getSrc_ip() {
		return src_ip;
	}
	public void setSrc_ip(String src_ip) {
		this.src_ip = src_ip;
	}
	public String getSig_rev() {
		return sig_rev;
	}
	public void setSig_rev(String sig_rev) {
		this.sig_rev = sig_rev;
	}
	public String getSig_name() {
		return sig_name;
	}
	public void setSig_name(String sig_name) {
		this.sig_name = sig_name;
	}
	public String getSig_id() {
		return sig_id;
	}
	public void setSig_id(String sig_id) {
		this.sig_id = sig_id;
	}
	public String getProtocol() {
		return protocol;
	}
	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public String getGen_id() {
		return gen_id;
	}
	public void setGen_id(String gen_id) {
		this.gen_id = gen_id;
	}
	public String getDst_port() {
		return dst_port;
	}
	public void setDst_port(String dst_port) {
		this.dst_port = dst_port;
	}
	public String getDst_ip() {
		return dst_ip;
	}
	public void setDst_ip(String dst_ip) {
		this.dst_ip = dst_ip;
	}
	public String getClassification() {
		return classification;
	}
	public void setClassification(String classification) {
		this.classification = classification;
	}
	public String getSOURCEIP() {
		return SOURCEIP;
	}
	public void setSOURCEIP(String sOURCEIP) {
		SOURCEIP = sOURCEIP;
	}
	public Date getDATE() {
		return DATE;
	}
	public void setDATE(Date dATE) {
		DATE = dATE;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public String getTo() {
		return to;
	}
	public void setTo(String to) {
		this.to = to;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getFromName() {
		return fromName;
	}
	public void setFromName(String fromName) {
		this.fromName = fromName;
	}
	public String getToName() {
		return toName;
	}
	public void setToName(String toName) {
		this.toName = toName;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
}
