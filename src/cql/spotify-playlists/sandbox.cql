insert into
    "Playlist"
        ("id", "name", "description", "isCollaborative", "modifiedAt", "numberOfTracks", "numberOfAlbums", "numberOfFollowers")
values
    (1000001, 'A beautifuel name', 'A elaborate description', false, 1435708800, 144, 117, 1);

insert into "Playlist" ("id", "name", "description", "isCollaborative", "modifiedAt", "numberOfTracks", "numberOfAlbums", "numberOfFollowers" values (1000001, 'A beautifuel name', 'A elaborate description', false, 1435708800, 144, 117, 1);

update
    "Playlist"
set
    "numberOfFollowers" = 2
where
    "id" = 1000001;

delete from
    "Playlist"
where
    "id" = 1000001;

select
    *
from
    "Playlist"
where
    "id" = 1000001;

