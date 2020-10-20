package controllers;
import dao.Command;
import dao.QueryDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import pojo.QueryResult;

import javax.persistence.Entity;
import java.util.List;


@RestController
public class Controller {

    @Autowired
    QueryDao dao;

    @GetMapping("/")
    public ModelAndView getIndexPage() {
        System.out.println("ver2");
        ModelAndView view = new ModelAndView("index");
        return view;
    }

    @PostMapping("command")
    public String activateQuery(@RequestBody Command command) {
        System.out.println("hire");
        System.out.println(command.getCommand() + " ");
        return dao.executeQuery(command.getCommand());
    }



    @GetMapping("string")
    public String getReverseString(@RequestParam String word ) {
        return new StringBuilder(word).reverse().toString();
    }

    @GetMapping("history")
    public List<QueryResult> getQueries() {
        return dao.findAll();
    }
}
