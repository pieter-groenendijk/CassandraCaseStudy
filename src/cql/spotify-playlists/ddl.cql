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

drop table if exists
    "Track";
drop table if exists
    "Playlist";
drop type if exists
    "NameURIPair";


create type
    "NameURIPair"
(
    "name" text,
    "URI" text
);


create table
    "Track"
(
    "name" text,
    "URI" text,
    "artist" frozen<"NameURIPair">,
    "durationInMs" int,
    "album" frozen<"NameURIPair">,
    primary key ("URI")
);

create materialized view // We give up write speed but maintain an consistent low read speed for when a tracks needs to be searched on by name (Search functionality)!
    "TrackByName"
as
select
    *
from
    "Track"
where
    "URI" is not null
    and "name" is not null
primary key (("name"), "URI");


create table
    "Playlist"
(
    "id" bigint,
    "name" text,
    "description" text,
    "isCollaborative" boolean,
    "modifiedAt" timestamp,
    "tracks" map<int, text>, // position, URI // Tracks are always loaded as a whole // Can't use a set since duplicate tracks inside a playlist is allowed.
    "durationInMs" bigint,
    "numberOfArtists" int,
    "numberOfAlbums" int,
    "numberOfTracks" int,
    "numberOfFollowers" int,
    "numberOfEdits" int,
    primary key (("name"), "id")
);