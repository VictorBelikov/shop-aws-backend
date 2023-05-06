-- create database CloudxShop;

create extension if not exists "uuid-ossp";

create type cart_state as enum ('OPEN', 'ORDERED');
create type order_state as enum ('PROCESSING', 'PAID', 'DELIVERED');

create table if not exists users(
    id uuid not null default uuid_generate_v4() primary key ,
    email varchar not null ,
    password varchar not null ,
    name text
);

create table if not exists carts(
    id uuid not null default uuid_generate_v4() primary key ,
    user_id uuid not null ,
    foreign key (user_id) references users(id) ,
    created_at date not null ,
    updated_at date not null,
    status cart_state
);

create table if not exists cart_items(
    cart_id uuid not null ,
    foreign key (cart_id) references carts(id) ,
    product_id uuid not null ,
    count numeric
);

create table if not exists orders(
    id uuid not null default uuid_generate_v4() primary key ,
    cart_id uuid not null ,
    foreign key (cart_id) references carts(id) ,
    user_id uuid not null ,
    comments text,
    total numeric,
    payment json,
    delivery json,
    status order_state
);

insert into users (id, email, password, name) values ('d620112f-1c5d-4bb5-ba1d-905b5b1285eb', 'someEmail1@example.com', 'pass_1', 'user_1');
insert into users (id, email, password, name) values ('a1324c6f-e53e-4127-ab9a-5acd74604a8d', 'someEmail2@example.com', 'pass_2', 'user_2');
insert into users (id, email, password, name) values ('00580619-2a67-4070-8f02-7e1994ee9fa1', 'someEmail3@example.com', 'pass_3', 'user_3');

insert into carts (id, user_id, created_at, updated_at, status) values ('62068e2d-4ab8-4ad1-8da3-9eb5ff2b67da', 'd620112f-1c5d-4bb5-ba1d-905b5b1285eb', '2023-01-12', '2023-01-12', 'ORDERED');
insert into carts (id, user_id, created_at, updated_at, status) values ('7393b00d-4965-4351-9214-93caa43f1ed9', 'd620112f-1c5d-4bb5-ba1d-905b5b1285eb', '2023-02-23', '2023-02-23', 'ORDERED');
insert into carts (id, user_id, created_at, updated_at, status) values ('e0378720-4aff-4ba7-933f-8bf15ab503f7', 'a1324c6f-e53e-4127-ab9a-5acd74604a8d', '2023-04-17', '2023-04-17', 'ORDERED');
insert into carts (id, user_id, created_at, updated_at, status) values ('693806b9-fd5a-4c51-8402-fe099a1f608e', '00580619-2a67-4070-8f02-7e1994ee9fa1', '2023-03-20', '2023-03-20', 'OPEN');

insert into cart_items (cart_id, product_id, count) values ('62068e2d-4ab8-4ad1-8da3-9eb5ff2b67da', '7567ec4b-b10c-48c5-9345-fc73c48a80aa', 5);
insert into cart_items (cart_id, product_id, count) values ('7393b00d-4965-4351-9214-93caa43f1ed9', '7567ec4b-b10c-48c5-9445-fc73c48a80a2', 6);
insert into cart_items (cart_id, product_id, count) values ('e0378720-4aff-4ba7-933f-8bf15ab503f7', '7567ec4b-b10c-45c5-9345-fc73c48a80a1', 7);
insert into cart_items (cart_id, product_id, count) values ('693806b9-fd5a-4c51-8402-fe099a1f608e', '7567ec4b-b10c-48c5-9345-fc73c48a80a3', 8);

insert into orders (id, cart_id, user_id, comments, total, payment, delivery, status)
    values ('4e714b86-ec10-4d6b-84e2-4ea16b21e435', '62068e2d-4ab8-4ad1-8da3-9eb5ff2b67da', 'd620112f-1c5d-4bb5-ba1d-905b5b1285eb', 'some_comment_1', 777, '{"type": "card"}', '{"type": "delivery_1", "address": "some_address_1"}', 'DELIVERED');

insert into orders (id, cart_id, user_id, comments, total, payment, delivery, status)
    values ('041e6da1-0480-41f3-aee8-f2e38517eb85', '7393b00d-4965-4351-9214-93caa43f1ed9', 'd620112f-1c5d-4bb5-ba1d-905b5b1285eb', 'some_comment_2', 555, '{"type": "card"}', '{"type": "delivery_2", "address": "some_address_2"}', 'PAID');

insert into orders (id, cart_id, user_id, comments, total, payment, delivery, status)
    values ('8c46257e-9f7b-4711-a635-786f4d56346e', 'e0378720-4aff-4ba7-933f-8bf15ab503f7', 'a1324c6f-e53e-4127-ab9a-5acd74604a8d', 'some_comment_3', 1111, '{"type": "card"}', '{"type": "delivery_3", "address": "some_address_3"}', 'DELIVERED');

insert into orders (id, cart_id, user_id, comments, total, payment, delivery, status)
    values ('5a1ab4a3-076e-44b8-acee-33047a902b77', '693806b9-fd5a-4c51-8402-fe099a1f608e', '00580619-2a67-4070-8f02-7e1994ee9fa1', 'some_comment_4', 88888, '{"type": "card"}', '{"type": "delivery_4", "address": "some_address_4"}', 'PROCESSING');
