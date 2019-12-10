
-- users-- 
create table pharmacy.p_users(
	id int(50) primary key auto_increment,
    email varchar(50) not null unique,
    username varchar(50) not null unique,
    password varchar(200) not null,
    role varchar(50) not null,
    date_created timestamp,
    date_updated date
);

-- category-- 
create table pharmacy.p_category(
	id int(50) primary key auto_increment,
    name varchar(150) not null,
    description text,
    created_date timestamp,
    created_by int(50) not null,
    updated_date date
);

-- items--
create table pharmacy.p_items(
	id int(50) primary key auto_increment,
    category_id int(50) not null,
    name varchar(150) not null,
    quantity numeric,
    price numeric,
    description text,
    created_date timestamp,
    created_by int(50) not null
); 

-- logs--
create table pharmacy.p_logs(
    id int(50) primary key auto_increment,
    log_name varchar(50) not null,
    category_id int(50),
    item_id int(50),
    price_from numeric,
    price_to numeric,
    quantity_from numeric,
    quantity_to numeric,
    created_date timestamp,
    created_by int(50) not null
); 


-- alter table for foreign keys --
ALTER TABLE pharmacy.p_logs 
    ADD CONSTRAINT category_logs
    FOREIGN KEY(category_id)
    REFERENCES pharmacy.p_category(id);
    
ALTER TABLE pharmacy.p_logs 
    ADD CONSTRAINT item_logs
    FOREIGN KEY(item_id)
    REFERENCES pharmacy.p_items(id);
    
ALTER TABLE pharmacy.p_logs 
    ADD CONSTRAINT user_logs
    FOREIGN KEY(created_by)
    REFERENCES pharmacy.p_users(id);
    
    
-- foreign keys for items
 ALTER TABLE pharmacy.p_items 
    ADD CONSTRAINT user_item
    FOREIGN KEY(created_by)
    REFERENCES pharmacy.p_users(id);
    
ALTER TABLE pharmacy.p_items 
    ADD CONSTRAINT category_items
    FOREIGN KEY(category_id)
    REFERENCES pharmacy.p_category(id);
    

-- foreign keys for category -- 
ALTER TABLE pharmacy.p_category 
    ADD CONSTRAINT user_category
    FOREIGN KEY(created_by)
    REFERENCES pharmacy.p_users(id);
    

    
    
