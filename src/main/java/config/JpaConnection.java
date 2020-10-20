package config;

import com.mysql.cj.jdbc.JdbcConnection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import com.mysql.cj.jdbc.MysqlDataSource;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;


import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

@Configuration
@EnableWebMvc
@EnableTransactionManagement
@ComponentScan(basePackages = {"controllers", "dao", "pojo"})
@PropertySource("classpath:application.properties")
public class JpaConnection  implements WebMvcConfigurer {

    @Autowired
    Environment environment;

    @Bean
    public DataSource getDataSource() {
            MysqlDataSource dataSource = new MysqlDataSource();
            dataSource.setURL(environment.getProperty("URL_SANDBOX"));
            dataSource.setUser(environment.getProperty("USER"));
            dataSource.setPassword(environment.getProperty("PASSWORD"));
            try (Connection con =  dataSource.getConnection()) {
                CallableStatement ans =  con.prepareCall("SELECT * FROM logs.LOGS");
                ResultSet set =  ans.executeQuery();
                while(set.next()) {
                    System.out.println(set.getNString("statement"));
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        ;
            return dataSource;
    }

    @Bean
    public JdbcTemplate getTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

  /*  @Bean
    public ThymeleafViewResolver viewResolver(){
        ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
        viewResolver.setTemplateEngine(new SpringTemplateEngine());
        viewResolver.setOrder(1);
        viewResolver.setViewNames(new String[] {".html", ".xhtml"});
        return viewResolver;
    }*/

  @Bean
    public ViewResolver getResolver() {
      InternalResourceViewResolver resolver = new InternalResourceViewResolver();
      resolver.setSuffix(".jsp");
      resolver.setPrefix("/WEB-INF/");
      return resolver;
  }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
      registry.addResourceHandler("/resources/**").addResourceLocations("/WEB-INF/resources/");
    }
}
