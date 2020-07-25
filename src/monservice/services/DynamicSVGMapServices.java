package monservice.services;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import monservice.models.DynamicSVGMapBean;
import monservice.utils.DynamicSVGMapServiceUtils;

@Path("/dynamicsvg")
public class DynamicSVGMapServices {
	DynamicSVGMapServiceUtils svMap = new DynamicSVGMapServiceUtils();
	
	@Path("/getdynamicmap")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getMapList(@QueryParam("idMap")int idMap) {
		DynamicSVGMapBean modelMap = null;
		try {
			modelMap = svMap.getDynamicMap(idMap);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
			    .entity(modelMap)
			    .build();
	}
}
