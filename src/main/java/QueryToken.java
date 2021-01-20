import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Map;

@XmlRootElement
public class QueryToken {
    @Getter
    @Setter
    Map<String, Object> executionResult;
}
