/*
    Author: Pieter Groenendijk
 */
/*
    Creating of a keyspace named "SpotifyPlaylists".
 */
drop keyspace if exists
    "SpotifyPlaylists";

create keyspace
    "SpotifyPlaylists"
with replication = {
    'class': 'SimpleStrategy', // Development purposes.
    'replication_factor': '1'
};

/*
    Set the current context to the newly made keyspace.
 */
use "SpotifyPlaylists";


drop type if exists
    "NameURIPair";

create type
    "NameURIPair"
(
    "name" text,
    "uri" text
);


drop table if exists
    "Track";

create table
    "Track"
(
    "name" text,
    "URI" text,
    "artist" frozen<"NameURIPair">,
    "durationInMs" int,
    "position" int,
    "album" frozen<"NameURIPair">,
    primary key (("URI"), "name") // "URI" is the partition key. "name" is a clustering column to allow efficient querying by track names.
);


drop table if exists
    "Playlist";

create table
    "Playlist"
(
    "id" bigint,
    "name" text,
    "description" text,
    "isCollaborative" boolean,
    "modifiedAt" timestamp,
    "tracks" list<text>, // Tracks are always loaded as a whole // Can't use a set since duplicate tracks inside a playlist is allowed.
    "durationInMs" bigint,
    "numberOfArtists" int,
    "numberOfAlbums" int,
    "numberOfTracks" int,
    "numberOfFollowers" int,
    "numberOfEdits" int,
    primary key (("id"), "name") // "ID" is the partition key. "name" is a clustering column to allow efficient querying by playlist names.
);