package monservice.services;

import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import monservice.models.DynamicMapBean;
import monservice.models.DynamicMapBlock;
import monservice.models.RangeIPModel;
import monservice.utils.DynamicMapServiceUtils;

@Path("/dynamicmap")
public class DynamicMapServices {		
	DynamicMapServiceUtils svMap = new DynamicMapServiceUtils();
	
	@Path("/getdynamicmap")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getMapList(@QueryParam("idMapLeft")int idMapLeft, @QueryParam("idMapRight")int idMapRight) {
		DynamicMapBlock modelMap = null;
		try {
			modelMap = svMap.getDynamicMap(idMapLeft,idMapRight);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
			    .entity(modelMap)
			    .build();
	}
}
