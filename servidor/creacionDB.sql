CREATE DATABASE IF NOT EXISTS gymdb;
USE gymdb;



CREATE TABLE payment_type_enum (
    value ENUM('MENSUAL','ANUAL','SEMANAL')
);

-- No es necesario realmente, MySQL permite ENUM directamente en la tabla:
-- ENUM('MENSUAL','ANUAL','SEMANAL')



CREATE TABLE IF NOT EXISTS auth_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    alta BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO auth_users (username, password)
VALUES ('admin', 'admin123');



CREATE TABLE IF NOT EXISTS trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    dni VARCHAR(15) NOT NULL UNIQUE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    tipo_pago ENUM('MENSUAL','ANUAL','SEMANAL') NOT NULL,
    alta BOOLEAN NOT NULL DEFAULT TRUE,
    telefono VARCHAR(30),
    email VARCHAR(150),
    especialidad VARCHAR(100),
    notas TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    dni VARCHAR(15) NOT NULL UNIQUE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    tipo_pago ENUM('MENSUAL','ANUAL','SEMANAL') NOT NULL,
    alta BOOLEAN NOT NULL DEFAULT TRUE,
    telefono VARCHAR(30),
    email VARCHAR(150),
    peso DECIMAL(5,2),
    altura INT,
    objetivo VARCHAR(200),
    trainer_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trainer
        FOREIGN KEY (trainer_id)
        REFERENCES trainers(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);


CREATE INDEX idx_trainers_dni ON trainers(dni);
CREATE INDEX idx_clients_dni ON clients(dni);
CREATE INDEX idx_clients_trainer ON clients(trainer_id);




INSERT INTO trainers (nombre, apellidos, fecha_nacimiento, dni, fecha_inicio, fecha_fin, tipo_pago, telefono, email, especialidad)
VALUES
('Luis','Gómez Ruiz','1985-02-20','11111111A','2025-01-01','2026-01-01','ANUAL','600111001','luis@gym.com','Fuerza'),
('Marta','Serrano López','1990-08-11','22222222B','2025-01-01','2025-12-31','MENSUAL','600111002','marta@gym.com','Cardio'),
('Carlos','Delgado Pérez','1987-05-09','33333333C','2025-02-01','2026-02-01','ANUAL','600111003','carlos@gym.com','Hipertrofia'),
('Ana','Martínez Soto','1992-01-18','44444444D','2025-01-15','2025-07-15','SEMANAL','600111004','ana@gym.com','Crossfit'),
('Javier','Moreno Ruiz','1984-11-30','55555555E','2025-03-01','2026-03-01','ANUAL','600111005','javier@gym.com','Potencia'),
('Patricia','López Navarro','1995-06-25','66666666F','2025-01-10','2025-12-10','MENSUAL','600111006','patri@gym.com','Funcional');


INSERT INTO clients (nombre, apellidos, fecha_nacimiento, dni, fecha_inicio, fecha_fin, tipo_pago, peso, altura, objetivo, trainer_id)
VALUES
('Jesús','Martínez López','2000-05-12','70000001A','2025-01-01','2025-02-01','MENSUAL',78.5,180,'Ganar masa',1),
('Pedro','Sánchez Ruiz','1998-10-10','70000002A','2025-01-05','2025-02-05','MENSUAL',72,175,'Perder grasa',1),
('Adrián','Castillo Peña','2002-09-15','70000003A','2025-01-10','2025-02-10','MENSUAL',69,178,'Tonificar',1),
('Samuel','Navarro Gil','1999-02-11','70000004A','2025-01-12','2025-02-12','MENSUAL',85,182,'Hipertrofia',1),
('Álvaro','Ramos Díaz','2001-07-22','70000005A','2025-01-15','2025-02-15','MENSUAL',90,185,'Fuerza',1),
('Hugo','Lara Torres','2003-03-17','70000006A','2025-01-18','2025-02-18','MENSUAL',77,179,'Ganar masa',1),
('Iván','Cano Rubio','1997-06-08','70000007A','2025-01-20','2025-02-20','MENSUAL',73,172,'Perder grasa',1),
('Sergio','Ortiz Alba','2000-04-01','70000008A','2025-01-21','2025-02-21','MENSUAL',82,181,'Hipertrofia',1),
('Diego','López Pardo','2004-11-05','70000009A','2025-01-23','2025-02-23','MENSUAL',65,170,'Tonificar',1),
('Rubén','Vega León','1996-12-19','70000010A','2025-01-25','2025-02-25','MENSUAL',88,183,'Fuerza',1);

INSERT INTO clients (nombre, apellidos, fecha_nacimiento, dni, fecha_inicio, fecha_fin, tipo_pago, peso, altura, objetivo, trainer_id)
VALUES
('Carlos','Muñoz Reina','1999-09-09','70000011A','2025-01-02','2025-02-02','MENSUAL',70,176,'Resistencia',2),
('Jorge','Santos Lara','2001-10-12','70000012A','2025-01-04','2026-01-04','ANUAL',90,190,'Fuerza',2),
('Óscar','Delgado Simón','2000-11-17','70000013A','2025-01-07','2025-02-07','MENSUAL',75,177,'Perder grasa',2),
('Pablo','Vargas Peña','1997-04-14','70000014A','2025-01-10','2025-02-10','MENSUAL',82,183,'Hipertrofia',2),
('Nicolás','Rey Lozano','2003-03-03','70000015A','2025-01-13','2025-02-13','MENSUAL',67,168,'Tonificar',2),
('Mario','Campos Real','2002-08-21','70000016A','2025-01-16','2025-02-16','MENSUAL',73,171,'Definición',2),
('Ismael','Romero Luna','1998-01-30','70000017A','2025-01-18','2025-02-18','MENSUAL',86,188,'Fuerza',2),
('David','Alonso Bravo','2004-02-11','70000018A','2025-01-19','2025-01-26','SEMANAL',61,165,'Tonificar',2),
('Raúl','Guerrero Mesa','2000-12-05','70000019A','2025-01-22','2025-02-22','MENSUAL',80,182,'Hipertrofia',2),
('Isco','Fuentes Polo','1999-07-07','70000020A','2025-01-24','2025-02-24','MENSUAL',88,186,'Fuerza',2);


INSERT INTO clients (nombre, apellidos, fecha_nacimiento, dni, fecha_inicio, fecha_fin, tipo_pago, peso, altura, objetivo, trainer_id)
VALUES
('Alejandro','Soria Ruiz','1998-11-22','70000021A','2025-01-03','2025-02-03','MENSUAL',92,188,'Hipertrofia',3),
('Víctor','Jiménez Soto','2001-12-01','70000022A','2025-01-05','2025-02-05','MENSUAL',76,178,'Definición',3),
('Francisco','Gil Robles','1999-05-09','70000023A','2025-01-08','2025-01-15','SEMANAL',71,174,'Resistencia',3),
('Álex','Reina Flores','2004-08-15','70000024A','2025-01-11','2025-02-11','MENSUAL',68,169,'Tonificar',3),
('Joel','Blanco Marín','2002-03-23','70000025A','2025-01-14','2026-01-14','ANUAL',85,183,'Fuerza',3),
('Gonzalo','Palma Ortiz','1997-07-05','70000026A','2025-01-17','2025-02-17','MENSUAL',91,187,'Hipertrofia',3),
('Fernando','Torres Cala','2000-10-20','70000027A','2025-01-20','2025-02-20','MENSUAL',74,172,'Perder grasa',3),
('Antonio','Lara Cortés','1998-09-29','70000028A','2025-01-22','2025-02-22','MENSUAL',80,180,'Equilibrio',3),
('Rafael','Ibáñez Real','2003-11-02','70000029A','2025-01-23','2025-02-23','MENSUAL',66,167,'Tonificar',3),
('Manuel','Sierra León','1996-05-11','70000030A','2025-01-25','2026-01-25','ANUAL',88,185,'Potencia',3);


INSERT INTO clients (nombre, apellidos, fecha_nacimiento, dni, fecha_inicio, fecha_fin, tipo_pago, peso, altura, objetivo, trainer_id)
VALUES
('Laura','Mena Ruiz','1999-04-09','70000031A','2025-01-03','2025-02-03','MENSUAL',55,165,'Tonificar',4),
('Cristina','López Sanz','1998-01-12','70000032A','2025-01-05','2025-01-12','SEMANAL',61,168,'Resistencia',4),
('Beatriz','Campos López','2000-10-22','70000033A','2025-01-07','2025-02-07','MENSUAL',59,170,'Definición',4),
('Eva','Rojas Torres','2002-09-14','70000034A','2025-01-09','2025-02-09','MENSUAL',62,166,'Cardio',4),
('Irene','Pérez Beltrán','2001-11-25','70000035A','2025-01-12','2025-02-12','MENSUAL',58,162,'Tonificar',4),
('Claudia','Gil Ramos','1997-06-18','70000036A','2025-01-15','2025-02-15','MENSUAL',65,171,'Fuerza',4),
('Sara','Navarro Lago','2003-08-09','70000037A','2025-01-17','2026-01-17','ANUAL',63,169,'Bienestar',4),
('Nuria','Soto Peña','1998-12-19','70000038A','2025-01-19','2025-02-19','MENSUAL',60,164,'Cardio',4),
('Marina','Vega Luna','1999-03-01','70000039A','2025-01-22','2025-02-22','MENSUAL',56,163,'Tonificar',4),
('Julia','Reyes Mora','2000-07-14','70000040A','2025-01-24','2025-02-24','MENSUAL',67,172,'Resistencia',4);


INSERT INTO clients (nombre, apellidos, fecha_nacimiento, dni, fecha_inicio, fecha_fin, tipo_pago, peso, altura, objetivo, trainer_id)
VALUES
('Tomás','Rivas Soler','1998-10-10','70000041A','2025-01-03','2025-02-03','MENSUAL',82,180,'Fuerza',5),
('Ángel','Cano Campos','1997-12-21','70000042A','2025-01-05','2026-01-05','ANUAL',77,178,'Potencia',5),
('Héctor','Lara Simón','2000-04-17','70000043A','2025-01-06','2025-02-06','MENSUAL',69,173,'Definición',5),
('Raúl','Garrido Real','2003-02-12','70000044A','2025-01-08','2025-02-08','MENSUAL',73,175,'Equilibrio',5),
('Andrés','Pardo Luque','1999-06-25','70000045A','2025-01-10','2025-02-10','MENSUAL',85,186,'Hipertrofia',5),
('Borja','Navas Olmo','1998-11-28','70000046A','2025-01-12','2025-01-19','SEMANAL',80,182,'Fuerza',5),
('Marc','Alonso Real','2001-01-19','70000047A','2025-01-14','2025-02-14','MENSUAL',71,174,'Tonificar',5),
('Lucas','Rey Bueno','2002-05-30','70000048A','2025-01-16','2025-02-16','MENSUAL',67,169,'Definición',5),
('Pau','Gómez Soto','1996-03-09','70000049A','2025-01-18','2025-02-18','MENSUAL',79,181,'Fuerza',5),
('Nil','Rovira Castillo','1998-09-22','70000050A','2025-01-20','2026-01-20','ANUAL',83,185,'Hipertrofia',5);


INSERT INTO clients (nombre, apellidos, fecha_nacimiento, dni, fecha_inicio, fecha_fin, tipo_pago, peso, altura, objetivo, trainer_id)
VALUES
('Elena','Torres Rivas','1999-11-01','70000051A','2025-01-04','2025-02-04','MENSUAL',58,164,'Tonificar',6),
('Paula','Navarro León','2000-06-20','70000052A','2025-01-06','2025-02-06','MENSUAL',61,167,'Cardio',6),
('Lucía','Campos Molina','2002-07-19','70000053A','2025-01-08','2025-01-15','SEMANAL',65,170,'Definición',6),
('Noelia','Rubio Sánchez','2003-02-05','70000054A','2025-01-10','2025-02-10','MENSUAL',57,163,'Tonificar',6),
('Alba','Rey Coronado','2001-04-22','70000055A','2025-01-12','2025-02-12','MENSUAL',63,168,'Hipertrofia',6),
('Miriam','Gómez Lara','1998-10-28','70000056A','2025-01-14','2025-02-14','MENSUAL',60,165,'Cardio',6),
('Patricia','Roldán Peña','2000-02-17','70000057A','2025-01-16','2025-02-16','MENSUAL',59,162,'Tonificar',6),
('Rocío','Martín Cruz','1997-07-09','70000058A','2025-01-18','2026-01-18','ANUAL',64,169,'Fuerza',6),
('Silvia','Lara Ramos','2004-03-25','70000059A','2025-01-20','2025-02-20','MENSUAL',56,160,'Definición',6),
('Ainhoa','Soto Vega','1999-09-14','70000060A','2025-01-22','2025-02-22','MENSUAL',62,167,'Tonificar',6);



ALTER TABLE clients ADD COLUMN foto VARCHAR(255);
ALTER TABLE trainers ADD COLUMN foto VARCHAR(255);