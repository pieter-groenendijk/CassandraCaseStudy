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
    primary key (("name"), "URI") -- Allows filtering based of "name", "URI" to make fully unique
);

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
    primary key (("name"), "id") -- Allows filtering based of "name", "id" to make fully unique
);

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
    primary key (("playlistId"), "URI") -- Allows filtering based of "playlistId", "URI" to make fully unique
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