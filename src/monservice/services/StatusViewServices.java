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
import monservice.models.StatusViewBean;
import monservice.utils.StatusMapServiceUtils;
import monservice.utils.StatusMapConfigPropertiesUtil;
import monservice.utils.StatusViewSerivceUtils;

@Path("/statusview")
public class StatusViewServices {
	StatusViewSerivceUtils svStatusView = new StatusViewSerivceUtils();

	@Path("/getviewlist")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getViewList(@QueryParam("type") String type,@QueryParam("limit") int limit) {
		List<StatusViewBean> listViewStatus = new ArrayList<StatusViewBean>();

		try {
			listViewStatus = svStatusView.getStateChangeList(type,limit);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		System.out.println("Status view list size: "+listViewStatus.size());
		
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
			    .entity(listViewStatus)
			    .build();
	}
	
	@Path("/setitemstatus")
	@POST
	@Produces({MediaType.APPLICATION_JSON })
	public Response setItemStatus(@QueryParam("id") int idItem,@QueryParam("status") int status) {
		String result = "success";
		
		try {
			svStatusView.updateStatusStateHistory(idItem, status);
		} catch (SQLException e) {
			e.printStackTrace();
			result="fail";
		}
		
		return Response.status(201)
				.header("Access-Control-Allow-Origin", "*")
				.entity("{\"result\": \""+result+"\"}")
				.build();
	}
}
