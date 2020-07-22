create table boosterpack
(
    id           int auto_increment
        primary key,
    price        decimal(10, 2) default 0.00              not null,
    bank         decimal(10, 2) default 0.00              not null,
    time_created timestamp      default CURRENT_TIMESTAMP null,
    time_updated timestamp      default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    charset = utf8;

INSERT INTO app_test.boosterpack (id, price, bank, time_created, time_updated) VALUES (1, 5.00, 2.00, '2020-03-30 00:17:28', '2020-07-21 23:29:48');
INSERT INTO app_test.boosterpack (id, price, bank, time_created, time_updated) VALUES (2, 20.00, 16.00, '2020-03-30 00:17:28', '2020-07-21 21:36:15');
INSERT INTO app_test.boosterpack (id, price, bank, time_created, time_updated) VALUES (3, 50.00, 120.00, '2020-03-30 00:17:28', '2020-07-22 00:02:47');
create table comment
(
    id           int auto_increment
        primary key,
    user_id      int unsigned                         not null,
    assign_id    int unsigned                         not null,
    text         text                                 not null,
    time_created timestamp  default CURRENT_TIMESTAMP null,
    time_updated timestamp  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    parent_id    int        default 0                 null,
    is_parent    tinyint(1) default 0                 not null
)
    charset = utf8;

create index user_id
    on comment (user_id);

INSERT INTO app_test.comment (id, user_id, assign_id, text, time_created, time_updated, parent_id, is_parent) VALUES (1, 1, 1, 'Ну чо ассигн проверим', '2020-03-27 21:39:44', '2020-07-20 22:10:03', 0, 1);
INSERT INTO app_test.comment (id, user_id, assign_id, text, time_created, time_updated, parent_id, is_parent) VALUES (2, 1, 1, 'Второй коммент', '2020-03-27 21:39:55', '2020-07-20 22:10:15', 1, 1);
INSERT INTO app_test.comment (id, user_id, assign_id, text, time_created, time_updated, parent_id, is_parent) VALUES (3, 2, 1, 'Второй коммент от второго человека', '2020-03-27 21:40:22', '2020-07-20 22:10:31', 0, 1);
create table post
(
    id           int auto_increment
        primary key,
    user_id      int unsigned                        not null,
    text         text                                not null,
    img          varchar(1024)                       null,
    time_created timestamp default CURRENT_TIMESTAMP null,
    time_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    charset = utf8;

create index user_id
    on post (user_id);

INSERT INTO app_test.post (id, user_id, text, img, time_created, time_updated) VALUES (1, 1, 'Тестовый постик 1', '/images/posts/1.png', '2018-08-30 13:31:14', '2020-07-18 22:35:18');
INSERT INTO app_test.post (id, user_id, text, img, time_created, time_updated) VALUES (2, 1, 'Печальный пост', '/images/posts/2.png', '2018-10-11 01:33:27', '2020-07-18 22:35:28');
create table user
(
    id                     int unsigned auto_increment
        primary key,
    email                  varchar(60)                              null,
    password               varchar(32)                              null,
    personaname            varchar(50)    default ''                not null,
    avatarfull             varchar(150)   default ''                not null,
    rights                 tinyint        default 0                 not null,
    wallet_likes           int            default 0                 null,
    wallet_total_refilled  decimal(10, 2) default 0.00              not null,
    wallet_total_withdrawn decimal(10, 2) default 0.00              not null,
    time_created           datetime                                 not null,
    time_updated           timestamp      default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    token                  varchar(16)                              null,
    wallet_balance         decimal(10, 2) default 0.00              not null,
    constraint email
        unique (email)
)
    charset = utf8;

create index time_created
    on user (time_created);

create index time_updated
    on user (time_updated);

INSERT INTO app_test.user (id, email, password, personaname, avatarfull, rights, wallet_likes, wallet_total_refilled, wallet_total_withdrawn, time_created, time_updated, token, wallet_balance) VALUES (1, 'admin@niceadminmail.pl', null, 'AdminProGod', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/96/967871835afdb29f131325125d4395d55386c07a_full.jpg', 0, 0, 0.00, 0.00, '2019-07-26 01:53:54', '2020-07-17 20:56:42', null, 0.00);
INSERT INTO app_test.user (id, email, password, personaname, avatarfull, rights, wallet_likes, wallet_total_refilled, wallet_total_withdrawn, time_created, time_updated, token, wallet_balance) VALUES (2, 'simpleuser@niceadminmail.pl', null, 'simpleuser', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/86/86a0c845038332896455a566a1f805660a13609b_full.jpg', 0, 0, 0.00, 0.00, '2019-07-26 01:53:54', '2020-07-17 20:56:42', null, 0.00);
INSERT INTO app_test.user (id, email, password, personaname, avatarfull, rights, wallet_likes, wallet_total_refilled, wallet_total_withdrawn, time_created, time_updated, token, wallet_balance) VALUES (3, 'user@gmail.com', 'password', 'username', '', 0, 0, 0.00, 0.00, '2020-04-18 00:46:28', '2020-07-22 00:12:11', '', 0.00);
create table user_boosterpack_history
(
    id             int auto_increment
        primary key,
    user_id        int unsigned  not null,
    boosterpack_id int           not null,
    likes          int default 0 not null,
    date_created   datetime      not null,
    constraint user_boosterpack_history_boosterpack_id_fk
        foreign key (boosterpack_id) references boosterpack (id),
    constraint user_boosterpack_history_user_id_fk
        foreign key (user_id) references user (id)
);

