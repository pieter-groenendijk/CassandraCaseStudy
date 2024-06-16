/*
    Author: Pieter Groenendijk
 */

/*
    An insert into the existing "ShoppingCart" table/column family.
    The only real changes are the used functions: toTimestamp() and now().

    - now() returns a timeuuid at the time the function is invoked.
    It's is guaranteed to be unique, which the mssql variant is not.
    - toTimestamp() (converts and) returns the given timeuuid into a timestamp type.


    Cassandra does not support multi-row inserts.
 */
insert into
    "Store"."ShoppingCart"
        ("userId", "itemCount", "lastUpdated")
values
    ('1', 2, toTimestamp(now()));

insert into
    "Store"."ShoppingCart"
        ("userId", "itemCount", "lastUpdated")
values
    ('2', 8, toTimestamp(now()));

/*
    Import to note is that an insert and update statement both performs an upsert
    operation. This means that if the record already exists it's replaced, otherwise it's inserted.

    This means that both of the following operations does the same thing; it updates the
    itemCount of the user with an userId of '1' to 4.
 */
/*
    1. Using an update statement
 */
update
    "Store"."ShoppingCart"
set
    "itemCount" = 4
where
    "userId" = '1';


/*
    2. Using an insert statement
 */
insert into
    "Store"."ShoppingCart"
        ("userId", "itemCount")
values
    ('1', 4);


/*
    Apart from deleting on the row level Cassandra can also delete on the column level.
    Meaning it can remove the associated data.

 */
delete from
    "ShoppingCart"
where
    "userId" = 1;

/*
    One can use "if" to add a condition in the where clause based on non-primary key columns;
    however it's not allowed to insert/update/delete a record with a where condition
    solely based of non-primary key columns.
 */
delete from
    "ShoppingCart"
where
    "userId" = '2'
    if "itemCount" = 8;
