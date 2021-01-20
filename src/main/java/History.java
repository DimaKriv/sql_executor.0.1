import java.io.File;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import java.util.Map;

/**
 * Business logic of history.
 */
public class History extends Logger{

    /***
     * Singleton design pattern.
     */
    private static History history = null;

    /***
     * Singleton initializer.
     * @return History Singleton object.
     * @throws SQLException
     */
    public static History of() throws SQLException{
        if (history == null) history = new History();
        return history;
    }

    /**
     * History db connection.
     */
    private Connection historyConnection = DriverManager.getConnection(
            "jdbc:sqlite:" + new File(".").getAbsolutePath()
                    + "/build/resources/main/history.db");
    private final String TABLE_NAME = "History";
    private final String STATEMENT = QueryMeta.STATEMENT.name;
    private final String DATE = QueryMeta.DATE.name;
    private final String TIME = QueryMeta.TIME.name;
    private final String IS_EXECUTER = "isExecuted";
    /**
     * Query for adding history.
     */
    private String insertHistory = "INSERT INTO " + TABLE_NAME + "("
            + STATEMENT + ", " + DATE +", " + TIME + ", " + IS_EXECUTER
            +") VALUES (?, ?, ?, ?)";
    /**
     * Query for selecting history.
     */
    private String selectHistory = "SELECT * FROM " + TABLE_NAME;

    private History() throws SQLException {
    }

    /**
     * Get data from history db.
     * @return List of History data.
     */
    public  HistroryTokenList getAllHistory() {
        try(Statement stmt = historyConnection.createStatement()) {
            ResultSet resultSet = stmt.executeQuery(this.selectHistory);
            List<HistoryToken> historyList = new ArrayList<>();
            while(resultSet.next()) {
                HistoryToken token = new HistoryToken(
                        resultSet.getString(STATEMENT), resultSet.getDate(DATE)
                        , resultSet.getLong(TIME), resultSet.getBoolean(IS_EXECUTER));
                historyList.add(token);
            }
            HistroryTokenList ans =  new HistroryTokenList();
            ans.setTokens(historyList);
            return ans;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Transform execution meta info into HistoryToken and then store it into db.
     * @param obj execution info.
     */
    @Override
    public void add(Object obj) {
        Map executionResult = (Map) obj;
        HistoryToken token = new HistoryToken(
                (String) executionResult.get(QueryMeta.STATEMENT.name),
                (Date) executionResult.get(QueryMeta.DATE.name),
                (Long) executionResult.get(QueryMeta.TIME.name),
                executionResult.get(QueryMeta.DATA.name) != null);
        System.out.println(token);
        if(!token.isValid()) throw new RuntimeException("Not valid for Storing history");
        executeHistoryToken(token);
    }

    /**
     * Insert logged data into table.
     * @param token SQL logged data.
     */
    public void executeHistoryToken(HistoryToken token) {
        try(PreparedStatement stmt = historyConnection.prepareStatement(insertHistory)) {
            stmt.setString(1, token.getStatement());
            stmt.setDate(2, new java.sql.Date(token.getExecutionDate().getTime()));
            stmt.setLong(3, token.getExecutionTime());
            stmt.setBoolean(4, token.isExecutedSuccess());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
