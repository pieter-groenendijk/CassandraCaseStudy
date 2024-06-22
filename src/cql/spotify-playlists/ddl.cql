-- Author: Pieter Groenendijk
-- Creating of a keyspace named "SpotifyPlaylists".

drop keyspace if exists
    "SpotifyPlaylists";

create keyspace
    "SpotifyPlaylists"
with replication = {
    'class': 'SimpleStrategy', -- Development purposes.
    'replication_factor': '1'
};


-- Set the current context to the newly made keyspace.
drop table if exists
    "SpotifyPlaylists"."Track";
drop table if exists
    "SpotifyPlaylists"."Playlist";
drop type if exists
    "SpotifyPlaylists"."NameURIPair";


create type
    "SpotifyPlaylists"."NameURIPair"
(
    "name" text,
    "URI" text
);


create table
    "SpotifyPlaylists"."Track"
(
    "name" text,
    "URI" text,
    "artist" frozen<"NameURIPair">,
    "durationInMs" int,
    "album" frozen<"NameURIPair">,
    primary key ("URI")
);

create materialized view -- Creates latency by around ~10% at writes but allows searching by "name". Needed for search functionality.
    "SpotifyPlaylists"."TrackByName"
as
select
    "name", "URI", "artist", "durationInMs", "album"
from
    "SpotifyPlaylists"."Track"
where
    "name" is not null
    and "URI" is not null
primary key (("name"), "URI"); -- partitioned by "name", "URI" as clustering column to make primary key fully unique.


create table
    "SpotifyPlaylists"."Playlist"
(
    "id" bigint,
    "name" text,
    "description" text,
    "isCollaborative" boolean,
    "modifiedAt" timestamp,
    "durationInMs" bigint,
    "numberOfArtists" int,
    "numberOfAlbums" int,
    "numberOfTracks" int,
    "numberOfFollowers" int,
    "numberOfEdits" int,
    primary key ("id")
);

create materialized view -- Creates latency by around ~10% at writes but allows searching by "name". Needed for search functionality
    "SpotifyPlaylists"."PlaylistByName"
as
select
    "id", "name", "description", "isCollaborative", "modifiedAt", "durationInMs", "numberOfArtists", "numberOfAlbums", "numberOfTracks", "numberOfFollowers", "numberOfEdits"
from
    "SpotifyPlaylists"."Playlist"
where
    "name" is not null
    and "id" is not null
primary key (("name"), "id"); -- partitioned by "name", "id" as clustering column to make primary key fully unique.

create table
    "SpotifyPlaylists"."PlaylistTrack" -- Duplication in the name of read speed. Only one partition needs to be read to retrieve all tracks of a playlist.
(
    "playlistId" bigint,
    "position" int,
    "name" text,
    "URI" text,
    "artist" frozen<"NameURIPair">,
    "durationInMs" int,
    "album" frozen<"NameURIPair">,
    primary key (("playlistId"), "URI")
);

-- create table
--     "SpotifyPlaylists"."MostFollowedPlaylist"
-- (
--     "id" bigint,
--     "name" text,
--     "description" text,
--     "isCollaborative" boolean,
--     "modifiedAt" timestamp,
--     "durationInMs" bigint,
--     "numberOfArtists" int,
--     "numberOfAlbums" int,
--     "numberOfTracks" int,
--     "numberOfFollowers" int,
--     "numberOfEdits" int,
--     primary key (("id"), "numberOfFollowers") // Allows filtering based of "name", "id" to make fully unique
-- ) with clustering order by ("numberOfFollowers" desc);