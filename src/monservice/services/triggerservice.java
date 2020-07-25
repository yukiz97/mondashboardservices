package monservice.services;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import monservice.models.StartDateEndDateModel;
import monservice.models.TriggerBean;
import monservice.utils.TriggerXMLServiceUtil;

import org.bson.Document;

import com.mongodb.client.FindIterable;

@Path("/camservice")
public class triggerservice {

	@Path("/gettrigerrlog")
	@GET
	@Produces({MediaType.APPLICATION_JSON })
	public Response getData() {
		StartDateEndDateModel param=new StartDateEndDateModel();

		Calendar startDate=Calendar.getInstance();
		startDate.set(Calendar.HOUR_OF_DAY, 0);
		startDate.set(Calendar.MINUTE, 0);
		startDate.set(Calendar.SECOND, 0);

		Calendar endDate=Calendar.getInstance();
		endDate.set(Calendar.HOUR_OF_DAY, 23);
		endDate.set(Calendar.MINUTE, 59);
		endDate.set(Calendar.SECOND, 59);

		param.setStartDate(startDate.getTime());
		param.setEndDate(endDate.getTime());
		System.out.println("GET");
		System.out.println("Tu ngay: "+param.getStartDate());
		System.out.println("Den ngay: "+param.getEndDate());
		return buildData(param);
	}

	@Path("/gettrigerrlog")
	@POST
	@Produces({MediaType.APPLICATION_JSON })
	public Response getData(StartDateEndDateModel param) {
		System.out.println("POST");
		System.out.println("Tu ngay: "+param.getStartDate());
		System.out.println("Den ngay: "+param.getEndDate());
		return buildData(param);
	}

	private Response buildData(StartDateEndDateModel param) {
		long start=System.currentTimeMillis();
		/* Json filter */
		Document filters=new Document();

		/* filter by date */
		Document date=new Document(); 
		date.append("$gte", param.getStartDate());
		date.append("$lte", param.getEndDate()); 

		filters.append("DATE", date);

		/* List Json match filter */
		List<Document> aggregate=new ArrayList<Document>();
		aggregate.add(filters);

		/* List result log */
		final List<Document> logList=new ArrayList<Document>();

		/* List collections Name */
		List<TriggerBean> listTriggerBean=TriggerXMLServiceUtil.getTriggerList();
		//		Thread[] threads=new Thread[listTriggerBean.size()];
		//		int threadOrder=0;

		for (TriggerBean triggerBean : listTriggerBean) {
			//			threads[threadOrder]=new Thread(new Runnable() {
			//				@Override
			//				public void run() {
			final String collectionName=triggerBean.getCollection();
			if(collectionName.length()>20 && collectionName.contains("trigger_")) {
				System.out.println(collectionName+"----");
				try {
					final FindIterable<Document> result=mongoservice.mongoDatabase.getCollection(collectionName).find(filters).limit(10);
					for (Document document : result) {
						document.remove("_id");
						document.remove("SEVERITY");
						document.remove("FACILITY");
						String message=document.get("MESSAGE").toString();
						if(message.length()>200) {
							document.put("MESSAGE", message.substring(0, 199)+" ...");
						}
						logList.add(document);
						//								if(logList.size()>100)
						//									break;
					}
				} catch (Exception e) {
					e.printStackTrace();
				}

			} 


			//					if(logList.size()>100)
			//						break;
			//				}
			//			});
			//			threads[threadOrder].start();
			//			threadOrder++;
		}

		//		try {
		//			for(int i=0;i<threadOrder;i++) {
		//				threads[i].join();
		//			}
		//		} catch (Exception e) {
		//			e.printStackTrace();
		//		}

		System.out.println("Trigger Size: "+logList.size()+", took: "+(System.currentTimeMillis()-start)+"ms");
		return Response.status(200).header("Access-Control-Allow-Origin", "*").entity(logList).build();
	}
}
