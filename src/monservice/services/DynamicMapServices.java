package monservice.services;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import monservice.models.DynamicMapBlock;
import monservice.utils.DynamicMapServiceUtils;
import monservice.utils.SnortMongoDBServiceUtils;

@Path("/dynamicmap")
public class DynamicMapServices {		
	DynamicMapServiceUtils svMap = new DynamicMapServiceUtils();
	
	@Path("/getdynamicmap")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getMapList(@QueryParam("idMapLeft")int idMapLeft, @QueryParam("idMapRight")int idMapRight, @QueryParam("template")int idTemplate) {
		DynamicMapBlock modelMap = null;
		try {
			modelMap = svMap.getDynamicMap(idMapLeft,idMapRight);
			
			if(idTemplate!=0) {
				modelMap.getFilter().addAll(DynamicMapServiceUtils.returnDynamicMapTemplateFilterList(idTemplate));
			}
			modelMap.getWhitelist().addAll(DynamicMapServiceUtils.returnRangeIpWhitelistList());
			modelMap.getUseriprecognize().addAll(DynamicMapServiceUtils.returnUserIPRecognize());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
			    .entity(modelMap)
			    .build();
	}
	
	@Path("/getsignamelist")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getSignatureNameList() {
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
			    .entity(SnortMongoDBServiceUtils.getDistinctSigName())
			    .build();
	}
	
	@Path("/getclassificationlist")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getClassificationList() {
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
			    .entity(SnortMongoDBServiceUtils.getDistinctClassification())
			    .build();
	}
}
