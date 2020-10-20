package dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.repository.Repository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import pojo.QueryResult;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class QueryDao implements Repository<QueryResult, Long> {
    @Autowired
    JdbcTemplate template;

    @Autowired
    Commands commands;

    public QueryResult findById(Long id) {
        return null;
    }

    public List<QueryResult> findAll() {
        return template.query(commands.getAllLogs(), new QueryResultMapper());
    }

    public void addQueryResult(QueryResult result) {
        template.update(commands.addLogSql(), new Object[] {result.getStatement()
                , result.getTime(), result.getDate(), result.getResult()});
    }

    public String executeQuery(String statement) {
        boolean isSucced = true;
        String ans = "";
        Long time = System.currentTimeMillis();
        try {
            ans = template.query(statement, new ResultSetExtractor<String>() {
                @Override
                public String extractData(ResultSet rs) throws SQLException, DataAccessException {
                    return ResultParser.dataSelectJson(rs);
                }
            });
        } catch (DataAccessException e) {
            System.out.println("SELECT EXP");
            System.out.println(e.toString());
            try {
                int amonut =  template.update(statement);
                ans = ResultParser.dataInsertJson(amonut);
            } catch (DataAccessException e1) {
                isSucced = false;
                ans = ResultParser.dataExceptionJson(e1.toString());
            }

        } finally {
            QueryResult res = new QueryResult();
            res.setStatement(statement);
            res.setDate(new Date(System.currentTimeMillis()));
            res.setResult(isSucced);
            res.setTime(Long.valueOf(System.currentTimeMillis() - time).intValue());
            addQueryResult(res);
        }
        return ans;
    }

    private class QueryResultMapper implements RowMapper<QueryResult> {

        @Override
        public QueryResult mapRow(ResultSet rs, int rowNum) throws SQLException {
            QueryResult result = new QueryResult();
             result.setStatement(rs.getNString("statement"));
             result.setId(rs.getLong("id"));
             result.setDate(rs.getDate("date"));
             result.setTime(rs.getInt("time"));
             result.setResult(rs.getBoolean("result"));
            return result;
        }
    }

}
