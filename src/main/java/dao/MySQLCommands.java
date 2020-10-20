package dao;

import org.springframework.stereotype.Component;

@Component
public class MySQLCommands implements Commands{

    public String addLogSql() {
        return "INSERT INTO logs.LOGS(statement, time, date, result) VALUES (?, ?, ?, ?)";
    }

    @Override
    public String getLogsSuccess() {
        return "SELECT * FROM logs.LOGS WHERE result = True";
    }

    @Override
    public String getAllLogs() {
        return "SELECT * FROM logs.LOGS";
    }

    @Override
    public String getLogsFailed() {
        return "SELECT * FROM logs.LOGS WHERE result = False";
    }
}
