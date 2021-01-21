import java.io.File;
import java.util.*;
import java.sql.*;
import java.util.Date;

/**
 * Executor of sql statement.
 */
public class QueryExecution extends LoggerSupported {
    /**
     * Connection of sandbox db.
     */
    Connection sandboxConnection = DriverManager.getConnection(
            "jdbc:sqlite:" + new File(".").getAbsolutePath() +
                    "/build/resources/main/sandbox.db");

    /**
     * Set logger to executor.
     * @throws SQLException
     */
    public QueryExecution() throws SQLException {
        super(History.of());
    }

    /**
     * Execute sql statement.
     * @param sqlStatement String.
     * @return execution result.
     */
    public Map execute(String sqlStatement) {
        Map<String, Object> executionResult = new LinkedHashMap<>();
        List<String> errors = new ArrayList<>();
        long startOfExecution = System.currentTimeMillis();
        LinkedList<Map<String, Object>> data = this.executeQuery(sqlStatement, errors);
        long timeOfExecution = System.currentTimeMillis() - startOfExecution;
        executionResult.put(QueryMeta.TIME.name, timeOfExecution);
        if (data != null) {
                executionResult.put(QueryMeta.DATA.name, data);
            }
        executionResult.put(QueryMeta.DATE.name, new Date());
        executionResult.put(QueryMeta.ERRORS.name, new LinkedList<>(errors));
        executionResult.put(QueryMeta.STATEMENT.name, sqlStatement);
        super.addToLog(executionResult);
        return executionResult;
    }


    /**
     * Execute query.
     * @param sql String.
     * @param errors Errors.
     * @return LinkedList.
     */
    private LinkedList<Map<String, Object>> executeQuery(
            String sql, List<String> errors) {
        try (Statement stmt = sandboxConnection.createStatement()){
           if (stmt.execute(sql)) {
               return executeRead(stmt);
           } else {
               return executeUpdate(stmt);
           }
        } catch (SQLException e) {
            errors.add(e.getMessage());
        } catch (NullPointerException e1) {
            errors.add(e1.getMessage());
        }
        return null;
    }

    /**
     * Execute READ statement.
     * @param stmt statement.
     * @return execution data.
     * @throws SQLException
     */
    private LinkedList<Map<String, Object>> executeRead(Statement stmt) throws SQLException {
        try(ResultSet resultSet = stmt.getResultSet()) {
            ResultSetMetaData metaData = resultSet.getMetaData();
            LinkedList<Map<String, Object>> data = new LinkedList<>();
            while (resultSet.next()) {
                Map<String, Object> jsonObj = new LinkedHashMap<>();
                for (int i = 1; i <= metaData.getColumnCount(); i++) {
                    jsonObj.put(metaData.getColumnName(i), resultSet.getObject(i));
                }
                data.add(jsonObj);
            }
            return  data;
        } catch (SQLException e) {
            throw new SQLException(e);
        }
    }

    /**
     * Execute UPDATE, CREATE, DELETE statement.
     * @param stmt statement.
     * @return execution data.
     * @throws SQLException
     */
    private LinkedList<Map<String, Object>> executeUpdate(Statement stmt) throws SQLException {
        try {
            Integer affectedRows = stmt.getUpdateCount();
            Map<String, Object> rows = Map.of("affectedRows", affectedRows);
            LinkedList<Map<String, Object>> data = new LinkedList<>();
            data.add(rows);
            return data;
        } catch (SQLException e) {
            throw new SQLException(e);
        }
    }
}
