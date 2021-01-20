/**
 * Bridge design pattern interface. Connect query executor and history logger.
 */
public abstract class Logger {
    /**
     * Add execution result to history db.
     * @param obj result data.
     */
    public abstract void add(Object obj);
}
