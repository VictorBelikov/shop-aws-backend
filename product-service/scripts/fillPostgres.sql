create database CloudxShop;

create extension if not exists "uuid-ossp";

create table if not exists products (
    id  uuid not null default uuid_generate_v4() primary key ,
    title text not null ,
    description text not null ,
    price numeric not null
);

create table if not exists stocks (
    id  uuid not null default uuid_generate_v4() primary key ,
    foreign key (id) references products(id) ,
    count numeric not null
);

insert into products (title, description, price) values ('Product1', 'Short Product Description1', 24);
insert into products (title, description, price) values ('Product2', 'Short Product Description2', 15);
insert into products (title, description, price) values ('Product3', 'Short Product Description3', 45);
insert into products (title, description, price) values ('Product4', 'Short Product Description4', 77);
insert into products (title, description, price) values ('Product5', 'Short Product Description5', 54);
insert into products (title, description, price) values ('Product6', 'Short Product Description6', 88);

insert into stocks (id, count) values ('ce6abb84-29d8-4268-8905-560cc18c77bf', 3);
insert into stocks (id, count) values ('cbbf9080-135d-45a1-81d1-bf97b4cdb68c', 5);
insert into stocks (id, count) values ('de249f76-ae7c-4822-87ac-7b4b6bbf3497', 4);
insert into stocks (id, count) values ('f467110b-986b-40a8-8429-d9755ddd6b76', 7);
insert into stocks (id, count) values ('e0706a62-3d34-4831-9832-69c487e3d50a', 12);
insert into stocks (id, count) values ('3d63fb2e-2bc3-4fc8-bd26-40908858f6d5', 44);
