package monservice.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import monservice.models.hostoverview.HostOverviewModel;
import monservice.utils.HostOverviewServiceUtils;

@Path("hostoverview")
public class HostOverviewServices {
	@Path("/getlist")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getMapList(@QueryParam("hoststate")String strHostState,@QueryParam("servicestate")String strServiceState) {
		List<String> listHostState = new ArrayList<String>(Arrays.asList(strHostState.split(",")));
		List<Integer> listHostStateInt = new ArrayList<Integer>();
		List<String> listServiceState = new ArrayList<String>(Arrays.asList(strServiceState.split(",")));
		List<Integer> listServiceStateInt = new ArrayList<Integer>();
		for(String hostState : listHostState) {
			listHostStateInt.add(Integer.parseInt(hostState));
		}
		for(String serviceState : listServiceState) {
			listServiceStateInt.add(Integer.parseInt(serviceState));
		}
		
		List<HostOverviewModel> listHostOverview = HostOverviewServiceUtils.getHostOverviewList(listHostStateInt,listServiceStateInt);
		
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
			    .entity(listHostOverview)
			    .build();
	}
}
