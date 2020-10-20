package pojo;

import org.hibernate.annotations.GeneratorType;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.text.SimpleDateFormat;
import java.util.Date;


@Entity
public class QueryResult {
    private int time;
    private Boolean result;
    @Id
    @GeneratedValue
    private long id;
    private Date date;
    private String statement;

    public String getStatement() {
        return statement;
    }

    public void setStatement(String statement) {
        this.statement = statement;
    }
    public void setTime(int time) {
        this.time = time;
    }

    public void setResult(Boolean result) {
        this.result = result;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getTime() {
        return time;
    }

    public Boolean getResult() {
        return result;
    }

    public long getId() {
        return id;
    }

    public Date getDate() {
        return date;
    }

}
