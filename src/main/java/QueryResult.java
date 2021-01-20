enum QueryMeta {
    ERRORS("errors"), TIME("time"), DATE("date")
    , DATA("data"), STATEMENT("statement");
    String name;
    QueryMeta(String str) {
        this.name = str;
    }
}
