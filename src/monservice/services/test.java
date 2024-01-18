package monservice.services;

import monservice.utils.CheckIpInIpRange;

public class test {

	public static void main(String[] args) {
		CheckIpInIpRange checkIp = new CheckIpInIpRange("10.30.0.0/22");
		
		System.out.println(checkIp.matches("10.30.0.238"));
	}

}
