/*
    Author: Pieter Groenendijk
 */

/*
    General Conventions:
    - Identifiers are quoted. This means they are case sensitive.
    - Keyspace and table names are written in PascalCase.
    - Column names are written in camelCase.
    - keywords are written in lowercase.
 */

/*
    Creating a keyspace.

    This is relatively similar to a mssql schema. A key difference is that a keyspace focuses
    on replication while a mssql schema focuses on security.

    Having said that, Cassandra handles security on a table/column family level, not schema/keyspace.
 */
drop keyspace if exists "Store";

create keyspace
    "Store"
with replication = {
    'class': 'SimpleStrategy',
    'replication_factor': '1'
};

/*
    We set the current context to the keyspace that we just made.

    This way we don't have to specify complicated identifiers like "Store"."ShoppingCart" but instead just "ShoppingCart"
 */
use "Store";

/*
    We create a table, or column family as it's called most of the time in Cassandra terms.

    We also create a primary key. While this all seems very similar there are most certainly some
    pretty big differences with the mssql equivalent. A primary key in cql does the following:
        - Uniquely identifies a row inside the table. If a record with the same primary key is
        inserted the record will get replaced (upsert)! This is very important to note!
        - Defines the partition key. This is the key that is hashed. This determines where the
        record will be stored; specifically, what node it is stored onto. A partition key is part of the primary key but not
        necessarily the entire primary key.

    In this case the partition key is the same as the partition key.


    Cassandra does not support column default values. For that reason we have to repeat
    toTimestamp(now()) for every record

    Cassandra does not support not null columns; every column not included in the primary key
    is optional.
 */
drop table if exists "ShoppingCart";

create table
    "ShoppingCart"
(
    "userId" text,
    "itemCount" int,
    "lastUpdated" timestamp,
    primary key ("userId")
);
