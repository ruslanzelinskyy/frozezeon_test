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

INSERT INTO app_test.boosterpack (id, price, bank, time_created, time_updated) VALUES (1, 5.00, 6.00, '2020-03-30 00:17:28', '2020-07-18 22:18:13');
INSERT INTO app_test.boosterpack (id, price, bank, time_created, time_updated) VALUES (2, 20.00, 12.00, '2020-03-30 00:17:28', '2020-07-18 22:19:03');
INSERT INTO app_test.boosterpack (id, price, bank, time_created, time_updated) VALUES (3, 50.00, 93.00, '2020-03-30 00:17:28', '2020-07-18 20:23:15');
create table comment
(
    id           int auto_increment
        primary key,
    user_id      int unsigned                        not null,
    assign_id    int unsigned                        not null,
    text         text                                not null,
    time_created timestamp default CURRENT_TIMESTAMP null,
    time_updated timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    charset = utf8;

create index user_id
    on comment (user_id);

INSERT INTO app_test.comment (id, user_id, assign_id, text, time_created, time_updated) VALUES (1, 1, 1, 'ÃÂÃ‘Æ’ Ã‘â€¡ÃÂ¾ ÃÂ°Ã‘ÂÃ‘ÂÃÂ¸ÃÂ³ÃÂ½ ÃÂ¿Ã‘â‚¬ÃÂ¾ÃÂ²ÃÂµÃ‘â‚¬ÃÂ¸ÃÂ¼', '2020-03-27 21:39:44', '2020-07-17 20:56:41');
INSERT INTO app_test.comment (id, user_id, assign_id, text, time_created, time_updated) VALUES (2, 1, 1, 'Ãâ€™Ã‘â€šÃÂ¾Ã‘â‚¬ÃÂ¾ÃÂ¹ ÃÂºÃÂ¾ÃÂ¼ÃÂ¼ÃÂµÃÂ½Ã‘â€š', '2020-03-27 21:39:55', '2020-07-17 20:56:41');
INSERT INTO app_test.comment (id, user_id, assign_id, text, time_created, time_updated) VALUES (3, 2, 1, 'Ãâ€™Ã‘â€šÃÂ¾Ã‘â‚¬ÃÂ¾ÃÂ¹ ÃÂºÃÂ¾ÃÂ¼ÃÂ¼ÃÂµÃÂ½Ã‘â€š ÃÂ¾Ã‘â€š ÃÂ²Ã‘â€šÃÂ¾Ã‘â‚¬ÃÂ¾ÃÂ³ÃÂ¾ Ã‘â€¡ÃÂµÃÂ»ÃÂ¾ÃÂ²ÃÂµÃÂºÃÂ°', '2020-03-27 21:40:22', '2020-07-17 20:56:41');
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
INSERT INTO app_test.user (id, email, password, personaname, avatarfull, rights, wallet_likes, wallet_total_refilled, wallet_total_withdrawn, time_created, time_updated, token, wallet_balance) VALUES (3, 'user@gmail.com', 'password', 'username', '', 0, 413, 53612.00, 0.00, '2020-04-18 00:46:28', '2020-07-18 22:19:48', 'ff899768d5', 53327.00);
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

INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (1, 3, 1, -5, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (2, 3, 1, -5, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (3, 3, 1, -22, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (4, 3, 1, -33, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (5, 3, 1, -42, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (6, 3, 1, -110, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (7, 3, 1, -180, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (8, 3, 1, 3, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (9, 3, 1, 2, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (10, 3, 1, 1, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (11, 3, 1, 2, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (12, 3, 1, 5, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (13, 3, 1, 1, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (14, 3, 1, 11, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (15, 3, 1, 3, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (16, 3, 1, 6, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (17, 3, 1, 2, '2020-07-07 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (18, 3, 1, 7, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (19, 3, 1, 2, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (20, 3, 1, 10, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (21, 3, 1, 3, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (22, 3, 1, 5, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (23, 3, 1, 2, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (24, 3, 2, 5, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (25, 3, 3, 30, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (26, 3, 2, 33, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (27, 3, 1, 5, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (28, 3, 1, 8, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (29, 3, 1, 6, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (30, 3, 1, 6, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (31, 3, 1, 5, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (32, 3, 1, 5, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (33, 3, 1, 4, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (34, 3, 1, 5, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (35, 3, 1, 1, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (36, 3, 1, 7, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (37, 3, 1, 6, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (38, 3, 1, 4, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (39, 3, 1, 7, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (40, 3, 1, 3, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (41, 3, 1, 8, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (42, 3, 1, 1, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (43, 3, 1, 4, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (44, 3, 1, 10, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (45, 3, 2, 8, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (46, 3, 3, 11, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (47, 3, 3, 25, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (48, 3, 3, 87, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (49, 3, 3, 2, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (50, 3, 3, 45, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (51, 3, 3, 54, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (52, 3, 3, 53, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (53, 3, 2, 12, '2020-07-08 00:00:00');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (54, 3, 2, 31, '2020-07-08 20:26:46');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (55, 3, 1, 1, '2020-07-09 21:15:50');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (56, 3, 1, 5, '2020-07-09 21:15:56');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (57, 3, 1, 4, '2020-07-09 21:16:45');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (58, 3, 1, 9, '2020-07-09 21:26:52');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (59, 3, 1, 1, '2020-07-09 21:39:10');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (60, 3, 1, 7, '2020-07-09 21:39:23');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (61, 3, 1, 2, '2020-07-10 22:18:13');
INSERT INTO app_test.user_boosterpack_history (id, user_id, boosterpack_id, likes, date_created) VALUES (62, 3, 2, 19, '2020-07-10 22:19:03');