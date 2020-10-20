package config;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class AppInit extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[]{JpaConnection.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{JpaConnection.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
}
