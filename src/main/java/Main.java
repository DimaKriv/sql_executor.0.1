import org.apache.cxf.jaxrs.JAXRSServerFactoryBean;
import org.apache.cxf.jaxrs.lifecycle.SingletonResourceProvider;
import org.apache.cxf.jaxrs.provider.json.JSONProvider;
import org.apache.cxf.rs.security.cors.CrossOriginResourceSharingFilter;
import org.apache.cxf.jaxrs.provider.RequestDispatcherProvider;

public class Main {
    public static void main(String[] args) {
        JSONProvider provider = new JSONProvider();
        JAXRSServerFactoryBean factory = new JAXRSServerFactoryBean();
        factory.setResourceClasses(HistoryService.class);
        factory.setResourceProvider(HistoryService.class
                , new SingletonResourceProvider(new HistoryService()));
        factory.setAddress("http://localhost:9000/");
        factory.setProvider(provider);
        factory.setProvider(new CrossOriginResourceSharingFilter());
        RequestDispatcherProvider redirect = new RequestDispatcherProvider();
        factory.setProvider(redirect);
        factory.create();
    }
}
