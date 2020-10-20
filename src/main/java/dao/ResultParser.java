package dao;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ResultParser {

    public static String dataSelectJson(ResultSet rs) throws SQLException {
        String ans = "{\"result\":\"Success\", \"data\":{";
        String[] headers = getHeaders(rs.getMetaData());
        List<String> data = getData(rs, headers.length);
        return parseData(headers, data, ans);
    }

    public static String dataInsertJson(int i) {
        return "{\"result\":\"Success\", \"data\":{\"amount\":[" + i + "]}}";
    }

    public static String dataExceptionJson(String e) {
        return "{\"result\":\"Error\", \"data\":{\"exception\":[\"" + e + "\"]}}";
    }

    private static String[] getHeaders(ResultSetMetaData rsm) throws SQLException {
         String[] headers =  new String[rsm.getColumnCount()];
         for(int i = 0; i < headers.length; i++) {
             headers[i] = rsm.getColumnName(i + 1);
         }
         return headers;
    }

    private static List<String> getData(ResultSet rs, int rowLength) throws SQLException {
        List<String> data = new ArrayList<>();
        while(rs.next()) {
            for(int i = 1; i <= rowLength;i++) {
                data.add(rs.getObject(i).toString());
            }
        }
        return data;
    }

    private static String parseData(String[] headers, List<String> array, String ans) {
        for (int i = 0; i < headers.length; i++) {
            ans += "\"" + headers[i] + "\":[";
            for (int j = 0; j < array.size(); j += headers.length) {
                ans += "\"" + array.get(j) + "\"";
                if (array.size() > headers.length + j) ans += ",";
            }
            if (headers.length > i + 1) ans += "],";
            else ans += "]}}";
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(parseData(new String[]{"A", "B", "C"}, Arrays.asList("a1","b1","c1","a2","b2","c2")
                , "{\"result\":\"Success\", \"data\":{"));
    }
}
