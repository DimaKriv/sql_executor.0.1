import org.apache.cxf.rs.security.cors.CrossOriginResourceSharing;
import org.json.simple.JSONObject;

import javax.ws.rs.*;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.io.*;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Path("/")
@Produces("application/json")
@Consumes("application/json")
public class HistoryService {
    /**
     * Reverse words in sentence.
     * @param word sentence.
     * @return word reversed sentence.
     */
    @GET
    @Path("/text/reverse/{word}")
    @CrossOriginResourceSharing(
            allowAllOrigins = true,
            allowCredentials = true,
            allowHeaders = {"Content-type"},
            maxAge = 1
    )
    public String reverseWord(@PathParam("word") String word) {
       return new TextProcessing().reverseWords(word);
    }

    /**
     * Return history.
     * @return HistoryToken.
     */
    @GET
    @Path("/history")
    @CrossOriginResourceSharing(
            allowAllOrigins = true,
            allowCredentials = true,
            allowHeaders = {"Content-type"},
            maxAge = 1
    )
    public Response getAllHistory() {
        try {
             return Response.ok().type(MediaType.APPLICATION_JSON_TYPE)
                     .header("Access-Control-Allow-Origin", "*")
                     .entity(History.of().getAllHistory()).build();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Execute query in sandbox db.
     * @param sql Query.
     * @return Query result.
     */
    @POST
    @Path("/sql/execute")
    @CrossOriginResourceSharing(
            allowAllOrigins = true,
            allowCredentials = true,
            allowHeaders = {"Content-type"},
            maxAge = 1
    )
    @Consumes("text/plain")
    public String executeSQl(String sql)  {
        try {
            System.out.println(sql);
            Map invalidData = new QueryExecution().execute(sql);
            Map validData = fixJsonLibraryDateProblem(invalidData);
            return JSONObject.toJSONString(validData);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Map  fixJsonLibraryDateProblem(Map exeJson) {
        exeJson.put(QueryMeta.DATE.name,
                exeJson.get(QueryMeta.DATE.name).toString());
        return exeJson;
    }
    @Path("static/{path:.*}")
    @GET
    @Produces({"text/html", "text/css"})
    public Response index(@PathParam("path") String param) {
        try {
            InputStream inputStream = new FileInputStream(
                    "build/resources/main/dist/" + param);
            System.out.println("static" + inputStream);
            return Response.ok().entity(inputStream).build();
        } catch (FileNotFoundException e) {
            System.out.println(e.getLocalizedMessage());
            return Response.status(Response.Status.NO_CONTENT).build();
        }
    }
}