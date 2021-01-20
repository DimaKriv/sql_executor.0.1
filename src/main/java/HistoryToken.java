import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

@XmlRootElement
@AllArgsConstructor
@NoArgsConstructor
public class HistoryToken {
        @Getter
        @Setter
        private String statement;
        @Getter @Setter
        private Date executionDate;
        @Getter @Setter
        private Long executionTime;
        @Getter @Setter
        private boolean isExecutedSuccess;

        public boolean isValid() {
            return statement != null && executionDate != null && executionTime != null;
        }
        @Override
        public String toString() {
                return statement + ": " + executionDate + ": " + executionTime + ": " + isExecutedSuccess;
        }
    }

