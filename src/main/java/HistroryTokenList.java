import com.sun.xml.txw2.annotation.XmlElement;
import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement
public class HistroryTokenList {
    @Setter
    @Getter
    List<HistoryToken> tokens;
}
