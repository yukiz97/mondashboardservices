package monservice.services;

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

import monservice.models.StatusMapTimeConfigBean;
import monservice.models.NagiosMapBean;
import monservice.utils.StatusMapServiceUtils;
import monservice.utils.StatusMapConfigPropertiesUtil;

@Path("/statusmap")
public class StatusMapServices {
	StatusMapServiceUtils svStatusMap = new StatusMapServiceUtils();

	@Path("/getmaplist")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getMapList() {
		List<NagiosMapBean> listMap = new ArrayList<NagiosMapBean>();

		try {
			listMap = svStatusMap.getListDataForSlide(-1);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		System.out.println("Status map list size: "+listMap.size());
		
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
			    .entity(listMap)
			    .build();
	}
	
	@Path("/getmap")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getMap(@QueryParam("idMap")int idMap) {
		List<NagiosMapBean> listMap = new ArrayList<NagiosMapBean>();

		try {
			listMap = svStatusMap.getListDataForSlide(idMap);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		System.out.println("Status map list size: "+listMap.size());
		
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
			    .entity(listMap)
			    .build();
	}
	
	@Path("/gettimeconfig")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getTimeConfig() {
		StatusMapTimeConfigBean modelTime = new StatusMapTimeConfigBean();

		modelTime.setChangeslide(Integer.parseInt(StatusMapConfigPropertiesUtil.getProperty("statusmap.time.changeslide")));
		modelTime.setRefresh(Integer.parseInt(StatusMapConfigPropertiesUtil.getProperty("statusmap.time.refreshpage")));

		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
			    .entity(modelTime)
			    .build();
	}
}