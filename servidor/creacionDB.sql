CREATE DATABASE IF NOT EXISTS gymdb;
USE gymdb;

-- 1. ESTRUCTURA DE TABLAS (Limpia)
CREATE TABLE IF NOT EXISTS auth_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    alta BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO auth_users (username, password) VALUES ('admin', 'admin123');

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
    foto VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
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
    foto VARCHAR(255),
    trainer_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 2. INSERTS DE 10 ENTRENADORES (DNI calculados con tu algoritmo)
INSERT INTO trainers (nombre, apellidos, fecha_nacimiento, dni, fecha_inicio, tipo_pago, especialidad, email, telefono) VALUES
('Marcos', 'García Ruiz', '1988-03-12', '48372615G', '2024-01-10', 'ANUAL', 'Crossfit', 'marcos@gym.com', '600111222'),
('Laura', 'Belmonte Pozo', '1992-07-25', '72348512W', '2024-02-15', 'MENSUAL', 'Yoga', 'laura@gym.com', '611222333'),
('Roberto', 'Sánchez Luna', '1985-11-02', '12345678Z', '2023-09-01', 'ANUAL', 'Powerlifting', 'roberto@gym.com', '622333444'),
('Sandra', 'Mora Jiménez', '1995-05-30', '87654321X', '2024-05-20', 'MENSUAL', 'Nutrición', 'sandra@gym.com', '633444555'),
('Javier', 'Ortega Cano', '1990-01-14', '54321098V', '2024-03-10', 'ANUAL', 'HIIT', 'javier@gym.com', '644555666'),
('Elena', 'Vargas Llopis', '1993-08-19', '11223344N', '2024-01-05', 'MENSUAL', 'Natación', 'elena@gym.com', '655666777'),
('Sergio', 'Pascual Cid', '1987-12-28', '99887766J', '2023-11-15', 'ANUAL', 'Boxeo', 'sergio@gym.com', '666777888'),
('Mónica', 'Ferrer Sola', '1994-04-03', '66554433D', '2024-06-01', 'SEMANAL', 'Zumba', 'monica@gym.com', '677888999'),
('David', 'Blasco Hoz', '1989-10-22', '22334455T', '2024-02-20', 'ANUAL', 'Culturismo', 'david@gym.com', '688999000'),
('Paula', 'Ramos Gil', '1996-06-07', '44332211B', '2024-04-12', 'MENSUAL', 'Rehabilitación', 'paula@gym.com', '699000111');

-- 3. INSERTS DE 50 CLIENTES (DNI calculados con tu algoritmo)
INSERT INTO clients (nombre, apellidos, fecha_nacimiento, dni, fecha_inicio, tipo_pago, peso, altura, objetivo, trainer_id, telefono, email) VALUES
('Adrián', 'López Sáez', '2001-05-10', '05234198T', '2025-01-05', 'MENSUAL', 75.2, 180, 'Ganar masa', NULL, '600000001', 'adrian@mail.com'),
('Beatriz', 'Gómez Martín', '1998-12-22', '12435687L', '2025-01-07', 'ANUAL', 62.0, 165, 'Perder peso', 2, NULL, NULL),
('Carlos', 'Díaz Ruiz', '1995-03-15', '23546789D', '2025-01-10', 'MENSUAL', 88.5, 178, 'Fuerza', 3, '600000003', NULL),
('Daniel', 'Sanz Vaca', '2000-08-30', '34657890X', '2025-01-12', 'SEMANAL', 70.0, 175, 'Mantenimiento', 4, '600000004', 'daniel@mail.com'),
('Esther', 'Pérez Gil', '1992-11-05', '45768901C', '2025-01-15', 'MENSUAL', 58.4, 160, NULL, 2, NULL, NULL),
('Fernando', 'Torres Joya', '1987-01-20', '56879012W', '2025-01-15', 'ANUAL', 95.0, 185, 'Definición', 9, '600000006', 'fer@mail.com'),
('Gema', 'Mora Luz', '2003-06-14', '67980123A', '2025-01-18', 'MENSUAL', 54.0, 162, 'Tonificar', 8, '600000007', 'gema@mail.com'),
('Hugo', 'Ramos Pardo', '1999-09-09', '78091234F', '2025-01-20', 'MENSUAL', 82.1, 182, 'Resistencia', 5, '600000008', 'hugo@mail.com'),
('Irene', 'Soto Real', '1996-04-25', '89102345K', '2025-01-22', 'ANUAL', 60.5, 168, 'Salud', 10, NULL, 'irene@mail.com'),
('Juan', 'Cano León', '1991-07-12', '90213456P', '2025-01-25', 'MENSUAL', 77.8, 174, 'Potencia', 3, '600000010', 'juan@mail.com'),
('Kiko', 'Mesa Polo', '1989-10-02', '01324567G', '2025-01-26', 'SEMANAL', 85.0, 180, 'Maratón', NULL, '600000011', NULL),
('Lucía', 'Vidal Rey', '2002-02-14', '11425367B', '2025-01-28', 'MENSUAL', 52.3, 163, 'Bienestar', 2, '600000012', 'lucia@mail.com'),
('Mario', 'Ortiz Cid', '1997-12-01', '22536478L', '2025-02-01', 'ANUAL', 91.2, 188, 'Culturismo', NULL, NULL, 'mario@mail.com'),
('Nuria', 'Blanco Sol', '1994-08-20', '33647589X', '2025-02-01', 'MENSUAL', 65.0, 170, 'Definición', 4, '600000014', 'nuria@mail.com'),
('Óscar', 'Luna Alba', '1985-05-05', '44758690T', '2025-02-03', 'MENSUAL', 80.0, 176, 'Fuerza', 3, '600000015', 'oscar@mail.com'),
('Patricia', 'Rivas Hoz', '1993-01-30', '55869701G', '2025-02-04', 'ANUAL', 59.0, 166, 'Yoga', 2, NULL, NULL),
('Quique', 'Marín Val', '2000-10-10', '66970812S', '2025-02-05', 'MENSUAL', 74.5, 179, 'Crossfit', 1, '600000017', 'quique@mail.com'),
('Rocío', 'Peña Mar', '1998-03-22', '77081923G', '2025-02-06', 'SEMANAL', 56.7, 164, 'Tonificar', 8, '600000018', 'rocio@mail.com'),
('Samuel', 'Soria Ros', '2001-09-15', '88192034M', '2025-02-07', 'MENSUAL', 83.4, 181, 'Grasa', 5, '600000019', 'samu@mail.com'),
('Teresa', 'Lara Paz', '1995-11-28', '99203145H', '2025-02-08', 'ANUAL', 61.2, 167, 'Mantenimiento', 4, NULL, 'teresa@mail.com'),
('Urbano', 'Gila Cruz', '1988-06-18', '02314256N', '2025-02-10', 'MENSUAL', 89.0, 184, 'Strongman', 3, '600000021', 'urbano@mail.com'),
('Valeria', 'Duro Mas', '2003-02-02', '13425367F', '2025-02-12', 'MENSUAL', 50.1, 158, 'Gimnasia', NULL, '600000022', NULL),
('Walter', 'Ramos Gil', '1992-04-12', '24536478G', '2025-02-14', 'ANUAL', 79.5, 177, 'Fitness', 5, NULL, 'walter@mail.com'),
('Xavi', 'Hernández P', '1986-08-08', '35647589M', '2025-02-15', 'MENSUAL', 72.0, 173, 'Agilidad', 6, '600000024', NULL),
('Yolanda', 'Sanz Bel', '1999-07-25', '46758690Y', '2025-02-16', 'SEMANAL', 55.4, 161, 'Zumba', 8, '600000025', 'yolanda@mail.com'),
('Zaira', 'López Rey', '2004-12-30', '57869701F', '2025-02-18', 'MENSUAL', 53.0, 160, 'Iniciación', 4, NULL, 'zaira@mail.com'),
('Álex', 'Forteza C', '1997-03-03', '68970812P', '2025-02-20', 'ANUAL', 86.3, 182, 'Rugby', 1, NULL, 'alex@mail.com'),
('Belén', 'Ramos Oca', '1990-10-20', '79081923B', '2025-02-21', 'MENSUAL', 64.2, 169, 'Post-parto', 10, '600000028', 'belen@mail.com'),
('Christian', 'Maza Sol', '2002-05-17', '80192034K', '2025-02-22', 'MENSUAL', 71.5, 175, 'Abdominales', 5, '600000029', 'chris@mail.com'),
('Diana', 'Vera Rico', '1994-01-09', '91203145E', '2025-02-23', 'ANUAL', 58.9, 166, 'Running', NULL, '600000030', NULL),
('Eric', 'Cantona J', '1985-02-14', '03314256N', '2025-02-25', 'MENSUAL', 88.0, 186, 'Fútbol', 1, '600000031', 'eric@mail.com'),
('Fanny', 'Rojo Pel', '2001-09-29', '14425367F', '2025-02-26', 'MENSUAL', 57.0, 164, 'Baile', NULL, NULL, 'fanny@mail.com'),
('Gonzalo', 'Miró Ros', '1993-04-05', '25536478G', '2025-02-27', 'ANUAL', 81.2, 179, 'Hipertrofia', 9, '600000033', 'gonza@mail.com'),
('Hilda', 'Gómez Can', '1996-11-12', '36647589M', '2025-02-28', 'MENSUAL', 66.4, 171, 'Cardio', 6, '600000034', 'hilda@mail.com'),
('Igor', 'Muller Von', '1991-06-25', '47758690Y', '2025-03-01', 'SEMANAL', 92.5, 190, 'Potencia', NULL, NULL, NULL),
('Julia', 'Navas Hoz', '1998-08-03', '58869701F', '2025-03-02', 'MENSUAL', 54.8, 162, 'Core', NULL, '600000036', 'julia@mail.com'),
('Kevin', 'De Bruy', '1994-05-22', '69970812P', '2025-03-03', 'ANUAL', 76.0, 181, 'Resistencia', 5, NULL, 'kevin@mail.com'),
('Lola', 'Índigo R', '1997-10-14', '70081923B', '2025-03-04', 'MENSUAL', 59.2, 167, 'Baile', 8, '600000038', 'lola@mail.com'),
('Mikel', 'Arteta O', '1989-12-19', '81192034K', '2025-03-05', 'MENSUAL', 78.4, 178, 'Táctica', 1, NULL, 'mikel@mail.com'),
('Nadia', 'Comaneci', '1995-01-01', '92203145E', '2025-03-06', 'ANUAL', 48.5, 155, 'Gimnasia', 10, '600000040', 'nadia@mail.com'),
('Oriol', 'Junqueras', '1990-03-20', '04314256N', '2025-03-08', 'MENSUAL', 99.0, 182, 'Cardio', 4, NULL, 'oriol@mail.com'),
('Pau', 'Gasol Sán', '1987-07-07', '15425367F', '2025-03-09', 'ANUAL', 110.0, 215, 'Basket', 3, NULL, 'pau@mail.com'),
('Rosa', 'Melano Ros', '1999-04-12', '26536478G', '2025-03-10', 'MENSUAL', 61.0, 168, 'Yoga', 2, '600000043', 'rosa@mail.com'),
('Santi', 'Cazorla M', '1988-11-15', '37647589M', '2025-03-11', 'MENSUAL', 68.0, 165, 'Rehab', 10, '600000044', NULL),
('Tatiana', 'Bulova K', '2002-02-28', '48758690Y', '2025-03-12', 'ANUAL', 52.0, 163, 'Flexibilidad', 2, '600000045', 'tati@mail.com'),
('Ulysses', 'Grant P', '1993-05-30', '59869701F', '2025-03-13', 'MENSUAL', 85.0, 183, 'Fuerza', 3, NULL, 'ulysses@mail.com'),
('Vanesa', 'Martín L', '1996-09-14', '60970812P', '2025-03-14', 'MENSUAL', 58.0, 166, 'Fondo', NULL, '600000047', 'vane@mail.com'),
('William', 'Wallace S', '1985-12-31', '71081923B', '2025-03-15', 'ANUAL', 94.0, 188, 'Cardio', NULL, '600000048', 'will@mail.com'),
('Xenia', 'Tostado F', '1994-06-21', '82192034K', '2025-03-16', 'MENSUAL', 55.0, 164, 'Pilates', NULL, '600000049', 'xenia@mail.com'),
('Yago', 'Aspas Jun', '1991-08-01', '93203145E', '2025-03-17', 'ANUAL', 70.0, 176, 'Velocidad', NULL, '600000050', 'yago@mail.com');