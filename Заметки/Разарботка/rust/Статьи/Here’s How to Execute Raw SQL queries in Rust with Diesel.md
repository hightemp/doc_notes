https://medium.com/intelliconnect-engineering/heres-how-to-execute-raw-sql-queries-in-rust-with-diesel-45902931a5f0

# Here’s How to Execute Raw SQL queries in Rust with Diesel

We all know diesel is the most productive way to interact with databases in Rust.

Diesel’s main goal is to prevent runtime errors at compile-time. For that, we create a representation of our database schema in Rust’s type system and use it to type check the entire query and make sure it is valid semantically.

Some use cases require us to execute raw SQL queries making it simpler than to build using a query builder. Diesel offers some escape hatches to execute raw SQL queries. This introduces a challenge to ensure type safety with a requirement for Diesel to access fields by name instead of index resulting in a scenario where you cannot deserialize these results into a tuple or a regular struct.

Now let's see how to execute raw SQL queries with Diesel.

If you want to know how to use Rust with Diesel for simple CRUD Operation, refer Diesel’s [Getting Started Guide](https://diesel.rs/guides/getting-started.html).

# Let's get started

We’ll be using `sql_query` function to build queries and will derive `QueryableByName` trait to our structs. Its important for Diesel needs to know SQL type of each field which can be done by annotation your struct with `#[table_name = “some_table”`] or by annotating each field with `#[sql_type = “SomeType”]`

Also note that if you combine both table_name and sql_type annotations, Diesel will override any fields using sql_type and pick the rest from the table.

Click [**here**](https://gist.github.com/steveh/7c7145409a5eed6b698ee8b609b6d1fc#file-postgresql-diesel-rust-types-md) to learn more mapping of PostgreSQL, Diesel, and Rust types

// File: src/models.rs  
  
  
// Here we bring the Diesel types and table into scope  
**use** diesel::sql_types::*;  
**use** crate::schema::user_login;  
  
// Notice that `fullname` is not a column on our users table,  
// but we're are going to return it by  
// concatenating the first and last name together.  
// QueryableByName will use the users table for  
// all other column types.  
#[derive(Debug, QueryableByName)]  
#[table_name = "user_login"]  
**pub** **struct** **User** {  
   **pub** id: i64,  
   **pub** firstname: String,  
   **pub** lastname: String,  
   **pub** email: String,  
   #[sql_type = "Text"]  
   **pub** fullname : String,  
}

**Example of schema**

table! {  
    user_login (id) {  
        id -> Int8,  
        firstname -> Text,  
        lastname -> Text,  
        email -> Text,  
    }  
}

**Example of Table in database**

**CREATE** **TABLE** user_login(  
**id** bigserial PRIMARY **KEY** ,  
firstname varchar(50) **NOT** NULL,  
lastname varchar(50) **NOT** NULL,  
email varchar(100) **NOT** NULL  
);

**Executing raw SQL query**

`[sql_query](https://docs.diesel.rs/diesel/fn.sql_query.html)` function is used in cases where a query needs to be written that is not supported by query builder; here as data will deserialize its data by name, not by index, you cannot deserialize into a tuple and structs will need to have `#[derive(QueryableByName)]`

If your query returns a column of an unexpected type, the results may return a wrong value or an error

// File: src/main.rs  
  
**use** diesel::prelude::*;  
**use** diesel::sql_query;  
**mod** model;//do change database-url if you don't want your code to break  
**fn** **getdbconn**() -> PgConnection {  
    **let** database_url = "Database-URL";  
    PgConnection::establish(&database_url).unwrap()  
}  
  
  
**fn** **main**() {  
    **let** conn = getdbconn();  
  
    **let** results = sql_query("SELECT  
    id,  
    firstname,  
    lastname,  
    email,  
    CONCAT(firstname, lastname) as fullname  
  FROM  
    user_login")  
        .load::<model::User>(&conn)  
        .unwrap();  
    println!("{:?}",results);  
}

You can find the code [here](https://github.com/intelliconnect/rust-lang-apps-rawsql)  
Thanks for reading!