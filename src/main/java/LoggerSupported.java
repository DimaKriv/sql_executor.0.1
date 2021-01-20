/**
 * Bridge design pattern abstract class. Connect query executor and history logger.
 */
public abstract class LoggerSupported {
    Logger log = null;

    /**
     * Add history logger to execution.
     * @param log Logger.
     */
    public LoggerSupported(Logger log) {
        this.log = log;
    }

    /**
     * Add execution result to history db.
     * @param obj result data.
     */
    public void addToLog(Object obj) {
        if (log != null) log.add(obj);
    }
}
