DROP DATABASE IF EXISTS hospital;
CREATE DATABASE hospital;
USE hospital;
CREATE TABLE MEDICATION (
	Expiration_date DATE,
	Med_Code INT PRIMARY KEY AUTO_INCREMENT,
	Med_Name VARCHAR(50) NOT NULL,
	Price DECIMAL(10, 2) NOT NULL,
	Effects VARCHAR(100) NOT NULL
);

INSERT INTO MEDICATION (Expiration_date, Med_Name, Price, Effects) 
VALUES 
    ('2025-08-15', 'Ibuprofen', 12.50, 'Pain relief, anti-inflammatory'),
    ('2024-11-20', 'Amoxicillin', 8.00, 'Antibiotic'),
    ('2026-01-10', 'Metformin', 5.75, 'Blood sugar control'),
    ('2025-12-01', 'Lisinopril', 10.00, 'Blood pressure control'),
    ('2024-09-25', 'Diphenhydramine', 7.20, 'Antihistamine');

CREATE TABLE PROVIDER (
    P_Name VARCHAR(100) NOT NULL,
    Provider_num INT PRIMARY KEY AUTO_INCREMENT,
    Phone VARCHAR(20) NOT NULL,
    Address VARCHAR(150) NOT NULL
);

INSERT INTO PROVIDER (P_Name, Phone, Address) 
VALUES
    ('Health Solutions Inc.', '1234567890', '123 Wellness St, Springfield'),
    ('PharmaPlus', '2345678901', '456 Health Ave, Metropolis'),
    ('MediCorp', '3456789012', '789 Care Rd, Gotham'),
    ('Global Pharma', '4567890123', '101 Pharmacy Ln, Star City'),
    ('Vitality Health', '5678901234', '202 Medical Dr, Central City');

CREATE TABLE PATIENT (
	Patient_Code VARCHAR(20) PRIMARY KEY,
    Phone_number VARCHAR(20) NOT NULL,
    Gender VARCHAR(10),
    F_name VARCHAR(20) NOT NULL,
    L_name VARCHAR(20) NOT NULL,
    Dob DATE,
    Address VARCHAR(150) NOT NULL
);

INSERT INTO PATIENT
VALUES 
('IP000000000', '0901234567', 'Male', 'John', 'Doe', '1990-06-15', '12 Nguyễn Huệ Street, District 1, Hồ Chí Minh City'),
('IP000000001', '0912345678', 'Female', 'Emily', 'Smith', '1985-09-22', '24 Lê Lợi Street, District 3, Hồ Chí Minh City'),
('OP000000000', '0923456789', 'Male', 'David', 'Nguyen', '1992-12-10', '50 Trần Hưng Đạo, District 5, Hồ Chí Minh City'),
('IP000000003', '0934567890', 'Female', 'Sophia', 'Trần', '1999-03-08', '100 Phạm Văn Đồng, District 7, Hồ Chí Minh City'),
('IP000000002', '0945678901', 'Male', 'Michael', 'Le', '1987-11-29', '75 Lý Thường Kiệt, District 10, Hồ Chí Minh City'),
('IP000000004', '0956789012', 'Female', 'Isabella', 'Hoang', '1995-07-14', '200 Võ Văn Tần, District 4, Hồ Chí Minh City'),
('OP000000002', '0967890123', 'Male', 'James', 'Phạm', '2000-01-25', '150 Nguyễn Văn Linh, District 2, Hồ Chí Minh City'),
('OP000000001', '0978901234', 'Female', 'Olivia', 'Bui', '1993-05-30', '60 Nguyễn Thị Minh Khai, District 9, Hồ Chí Minh City'),
('OP000000003', '0989012345', 'Male', 'Henry', 'Vũ', '1988-10-10', '34 Hai Bà Trưng, District 11, Hồ Chí Minh City'),
('OP000000004', '0990123456', 'Female', 'Charlotte', 'Phan', '1997-08-05', '80 Đinh Tiên Hoàng, District 6, Hồ Chí Minh City');


CREATE TABLE EMPLOYEE (
	Emp_Code VARCHAR(20) PRIMARY KEY,
    Dob DATE,
    `Specialty Name` VARCHAR(50) NOT NULL,
    `Degree's year` INT NOT NULL,
	`Start date` DATE NOT NULL,
    Address VARCHAR(150) NOT NULL,
    F_name VARCHAR(20) NOT NULL,
    L_name VARCHAR(20) NOT NULL,
    Phone_number VARCHAR(20) NOT NULL,
    Gender VARCHAR(20),
    Dept_Code VARCHAR(20) NOT NULL
);

INSERT INTO EMPLOYEE
VALUES
('D001', '1980-01-15', 'Cardiology', 2005, '2010-06-10', '123 Lê Lợi, District 1, Hồ Chí Minh City', 'John', 'Doe', '0912345678', 'Male', 'Doc'),
('D002', '1985-02-20', 'Pediatrics', 2010, '2015-07-15', '456 Trần Hưng Đạo, District 5, Hồ Chí Minh City', 'Emily', 'Nguyen', '0923456789', 'Female', 'Doc'),
('D003', '1975-03-12', 'Neurology', 2000, '2005-08-20', '789 Phạm Văn Đồng, District 7, Hồ Chí Minh City', 'David', 'Smith', '0934567890', 'Male', 'Doc'),
('D004', '1990-04-05', 'Orthopedics', 2015, '2020-09-25', '101 Võ Văn Tần, District 3, Hồ Chí Minh City', 'Sophia', 'Le', '0945678901', 'Female', 'Doc'),
('D005', '1988-05-18', 'Dermatology', 2012, '2018-11-30', '202 Nguyễn Huệ, District 10, Hồ Chí Minh City', 'James', 'Tran', '0956789012', 'Male', 'Doc'),
('N001', '1982-06-25', 'Nursing', 2008, '2012-06-12', '50 Trần Quang Khải, District 2, Hồ Chí Minh City', 'Isabella', 'Pham', '0967890123', 'Female', 'Nu'),
('N002', '1991-07-30', 'Nursing', 2014, '2016-07-15', '35 Nguyễn Trãi, District 4, Hồ Chí Minh City', 'Michael', 'Bui', '0978901234', 'Male', 'Nu'),
('N003', '1989-08-22', 'Nursing', 2013, '2017-08-20', '123 Điện Biên Phủ, District 6, Hồ Chí Minh City', 'Olivia', 'Hoang', '0989012345', 'Female', 'Nu'),
('N004', '1995-09-10', 'Nursing', 2018, '2020-09-01', '456 Lê Văn Sỹ, District 9, Hồ Chí Minh City', 'Henry', 'Vu', '0990123456', 'Male', 'Nu'),
('N005', '1983-10-05', 'Nursing', 2009, '2011-10-10', '789 Đinh Tiên Hoàng, District 11, Hồ Chí Minh City', 'Charlotte', 'Phan', '0901234567', 'Female', 'Nu');

CREATE TABLE DOCTOR (
	Doc_Code VARCHAR(20) PRIMARY KEY
);

CREATE TABLE USER (
	User_Code VARCHAR(20) PRIMARY KEY,
    Email VARCHAR(50) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Role VARCHAR(20) NOT NULL
);

INSERT INTO USER
VALUES
('7777', 'vyhspro12345@gmail.com', '$2b$10$ydCriD.7WdoxOJ6y9bblhOZxMFuYGeR1LmYTsqsX38rtageOUK286', 'Manager');

INSERT INTO DOCTOR
VALUES 
('D001'),
('D002'),
('D003'),
('D004'),
('D005');

CREATE TABLE NURSE (
	Nurse_Code VARCHAR(20) PRIMARY KEY
);

INSERT INTO NURSE
VALUES 
('N001'),
('N002'),
('N003'),
('N004'),
('N005');

CREATE TABLE DEAN (
	Doc_Code VARCHAR(20) PRIMARY KEY,
    `Experience year` INT NOT NULL
);

INSERT INTO DEAN 
VALUES 
('D001', 10),
('D002', 8); 

CREATE TABLE DEPARTMENT (
	Dept_Code VARCHAR(20) PRIMARY KEY,
    Title VARCHAR(50) NOT NULL,
    Doc_Code VARCHAR(20) NOT NULL
);

INSERT INTO DEPARTMENT (Dept_Code, Title, Doc_Code) VALUES
('Doc', 'Doctor', 'D001'),
('Nu', 'Nurse', 'D002');

CREATE TABLE PROVIDE (
	Med_code INT,
    Provider_num INT,
    PRIMARY KEY(Med_Code, Provider_num)
);

INSERT INTO PROVIDE (Med_code, Provider_num) 
VALUES 
    (1, 1),
    (1, 2),
    (2, 1),
    (3, 3),
    (4, 4);

CREATE TABLE TREATMENT_MED (
	Med_Code INT,
    Doc_Code VARCHAR(20),
    IP_Code VARCHAR(20),
	`Start date` DATE,
    `End date` DATE,
    PRIMARY KEY(Med_Code, Doc_Code, IP_Code, `Start date`, `End date`)
);

INSERT INTO TREATMENT_MED (Med_Code, Doc_Code, IP_Code, `Start date`, `End date`)
VALUES
    (1, 'D001', 'IP000000000', '2024-01-01', '2024-01-10'),
    (2, 'D001', 'IP000000000', '2024-01-11', '2024-01-13'),
    (1, 'D002', 'IP000000001', '2024-01-05', '2024-01-15'),
    (3, 'D003', 'IP000000002', '2024-02-10', '2024-02-20'),
    (2, 'D004', 'IP000000003', '2024-03-01', '2024-03-10'),
    (4, 'D005', 'IP000000004', '2024-04-12', '2024-04-22');
    
CREATE TABLE TREATMENT_DETAIL (
    Doc_Code VARCHAR(20),
    IP_Code VARCHAR(20),
	`Start date` DATE,
    `End date` DATE,
    Result VARCHAR(100),
    PRIMARY KEY(Doc_Code, IP_Code, `Start date`, `End date`)
);

INSERT INTO TREATMENT_DETAIL
VALUES 
('D001', 'IP000000000', '2024-01-01', '2024-01-10', 'Recovered'),
('D001', 'IP000000000', '2024-01-11', '2024-01-13', 'Heart failured'),
('D002', 'IP000000001', '2024-01-05', '2024-01-15', 'Improved'),
('D003', 'IP000000002', '2024-02-10', '2024-02-20', 'Stable'),
('D004', 'IP000000003', '2024-03-01', '2024-03-10', 'Recovered'),
('D005', 'IP000000004', '2024-04-12', '2024-04-22', 'Under Observation');

CREATE TABLE INPATIENT (
	IP_Code VARCHAR(20) PRIMARY KEY,
    `Date of admission` DATE NOT NULL,
    Diagnosis VARCHAR(100),
    Fee DECIMAL(10,2),
    `Date of discharge` DATE,
    Sickroom VARCHAR(20) NOT NULL,
    Nurse_Code VARCHAR(20) NOT NULL
);

INSERT INTO INPATIENT
VALUES 
('IP000000000', '2024-01-01', 'Flu', 1000.00, '2024-01-10', 'Room 101', 'N001'),
('IP000000001', '2024-02-15', 'Pneumonia', 2000.00, '2024-02-22', 'Room 102', 'N002'),
('IP000000002', '2024-03-05', 'Broken Leg', 1500.00, '2024-03-12', 'Room 103', 'N003'),
('IP000000003', '2024-04-10', 'Appendicitis', 2500.00, '2024-04-20', 'Room 104', 'N004'),
('IP000000004', '2024-05-01', 'Migraine', 1200.00, '2024-05-07', 'Room 105', 'N005');

CREATE TABLE EXAMINATION_MED (
	Med_Code INT,
    Doc_Code VARCHAR(20),
    OP_Code VARCHAR(20),
    `Examination date` DATE,
    PRIMARY KEY(Med_Code, Doc_Code, OP_Code, `Examination date`)
);

INSERT INTO EXAMINATION_MED (Med_Code, Doc_Code, OP_Code, `Examination date`)
VALUES
    (1, 'D001', 'OP000000000', '2024-01-15'),
    (2, 'D002', 'OP000000001', '2024-01-20'),
    (3, 'D003', 'OP000000002', '2024-01-25'),
    (4, 'D004', 'OP000000003', '2024-02-05'),
    (5, 'D005', 'OP000000004', '2024-02-10');

CREATE TABLE EXAMINATION_DETAIL (
    Doc_Code VARCHAR(20),
    OP_Code VARCHAR(20),
	`Examination date` DATE,
    Diagnosis VARCHAR(100),
    Fee DECIMAL(10, 2),
    Next_examination DATE,
    PRIMARY KEY(Doc_Code, OP_Code, `Examination date`)
);

INSERT INTO EXAMINATION_DETAIL (Doc_Code, OP_Code, `Examination date`, Diagnosis, Fee, Next_examination) VALUES
('D001', 'OP000000000', '2024-01-15', 'Routine Checkup', 150.00, '2024-02-15'),
('D002', 'OP000000001', '2024-01-20', 'Dental Checkup', 200.00, '2024-02-20'),
('D003', 'OP000000002', '2024-01-25', 'Annual Physical', 100.00, '2024-02-25'),
('D004', 'OP000000003', '2024-02-05', 'Flu Symptoms', 80.00, '2024-02-15'),
('D005', 'OP000000004', '2024-02-10', 'Blood Test', 120.00, '2024-03-10');

CREATE TABLE OUTPATIENT (
	OP_Code VARCHAR(20) PRIMARY KEY
);

INSERT INTO OUTPATIENT
VALUES 
('OP000000000'),
('OP000000001'),
('OP000000002'),
('OP000000003'),
('OP000000004');

-- -- -- -- -- -- foreign key

ALTER TABLE EMPLOYEE ADD FOREIGN KEY(Dept_Code) REFERENCES DEPARTMENT(Dept_Code);

ALTER TABLE DEPARTMENT ADD FOREIGN KEY(Doc_Code) REFERENCES DEAN(Doc_Code);

ALTER TABLE DEAN ADD FOREIGN KEY(Doc_Code) REFERENCES DOCTOR(Doc_Code);

ALTER TABLE DOCTOR ADD FOREIGN KEY(Doc_Code) REFERENCES EMPLOYEE(Emp_Code);

ALTER TABLE NURSE ADD FOREIGN KEY(Nurse_Code) REFERENCES EMPLOYEE(Emp_Code);

ALTER TABLE EXAMINATION_DETAIL ADD FOREIGN KEY(Doc_Code) REFERENCES DOCTOR(Doc_Code);
ALTER TABLE EXAMINATION_DETAIL ADD FOREIGN KEY(OP_Code) REFERENCES OUTPATIENT(OP_Code) ON DELETE CASCADE;

ALTER TABLE OUTPATIENT ADD FOREIGN KEY(OP_Code) REFERENCES PATIENT(Patient_Code) ON DELETE CASCADE;

ALTER TABLE INPATIENT ADD FOREIGN KEY(IP_Code) REFERENCES PATIENT(Patient_Code) ON DELETE CASCADE;

ALTER TABLE TREATMENT_DETAIL ADD FOREIGN KEY(Doc_Code) REFERENCES DOCTOR(Doc_Code);
ALTER TABLE TREATMENT_DETAIL ADD FOREIGN KEY(IP_Code) REFERENCES INPATIENT(IP_Code) ON DELETE CASCADE;

ALTER TABLE EXAMINATION_MED ADD FOREIGN KEY(Med_Code) REFERENCES MEDICATION(Med_Code);
ALTER TABLE EXAMINATION_MED ADD FOREIGN KEY(Doc_Code, OP_Code, `Examination date`) REFERENCES EXAMINATION_DETAIL(Doc_Code, OP_Code, `Examination date`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE TREATMENT_MED ADD FOREIGN KEY(Med_Code) REFERENCES MEDICATION(Med_Code);
ALTER TABLE TREATMENT_MED ADD FOREIGN KEY(Doc_Code, IP_Code,`Start date`, `End date`) REFERENCES TREATMENT_DETAIL(Doc_Code, IP_Code,`Start date`, `End date`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE PROVIDE ADD FOREIGN KEY(Med_code) REFERENCES MEDICATION(Med_Code);
ALTER TABLE PROVIDE ADD FOREIGN KEY(Provider_num) REFERENCES PROVIDER(Provider_num);

DROP USER IF EXISTS 'D001'@'localhost';
DROP USER IF EXISTS 'D002'@'localhost';
DROP USER IF EXISTS 'D003'@'localhost';
DROP USER IF EXISTS 'D004'@'localhost';
DROP USER IF EXISTS 'D005'@'localhost';
DROP USER IF EXISTS 'N001'@'localhost';
DROP USER IF EXISTS 'N002'@'localhost';
DROP USER IF EXISTS 'N003'@'localhost';
DROP USER IF EXISTS 'N004'@'localhost';
DROP USER IF EXISTS 'N005'@'localhost';

CREATE USER 'D001'@'localhost' IDENTIFIED BY '123';
CREATE USER 'D002'@'localhost' IDENTIFIED BY '234';
CREATE USER 'D003'@'localhost' IDENTIFIED BY '345';
CREATE USER 'D004'@'localhost' IDENTIFIED BY '456';
CREATE USER 'D005'@'localhost' IDENTIFIED BY '567';
CREATE USER 'N001'@'localhost' IDENTIFIED BY '678';
CREATE USER 'N002'@'localhost' IDENTIFIED BY '789';
CREATE USER 'N003'@'localhost' IDENTIFIED BY '890';
CREATE USER 'N004'@'localhost' IDENTIFIED BY '901';
CREATE USER 'N005'@'localhost' IDENTIFIED BY '012';

-- Grant permissions to department heads (D001 and D002) all rights
GRANT ALL PRIVILEGES ON hospital.* TO 'D001'@'localhost';
GRANT ALL PRIVILEGES ON hospital.* TO 'D002'@'localhost';
GRANT ALL PRIVILEGES ON hospital.* TO 'root'@'localhost';

-- For D003
GRANT SELECT, INSERT ON hospital.provide TO 'D003'@'localhost';
GRANT SELECT, INSERT ON hospital.provider TO 'D003'@'localhost';
GRANT SELECT, INSERT ON hospital.medication TO 'D003'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_med TO 'D003'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_med TO 'D003'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_detail TO 'D003'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_detail TO 'D003'@'localhost';
GRANT SELECT, INSERT ON hospital.outpatient TO 'D003'@'localhost';
GRANT SELECT, INSERT ON hospital.inpatient TO 'D003'@'localhost';
GRANT SELECT, INSERT ON hospital.patient TO 'D003'@'localhost';
GRANT SELECT ON hospital.employee to 'D003'@'localhost';

-- For D004
GRANT SELECT, INSERT ON hospital.provide TO 'D004'@'localhost';
GRANT SELECT, INSERT ON hospital.provider TO 'D004'@'localhost';
GRANT SELECT, INSERT ON hospital.medication TO 'D004'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_med TO 'D004'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_med TO 'D004'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_detail TO 'D004'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_detail TO 'D004'@'localhost';
GRANT SELECT, INSERT ON hospital.outpatient TO 'D004'@'localhost';
GRANT SELECT, INSERT ON hospital.inpatient TO 'D004'@'localhost';
GRANT SELECT, INSERT ON hospital.patient TO 'D004'@'localhost';
GRANT SELECT ON hospital.employee to 'D004'@'localhost';

-- For D005
GRANT SELECT, INSERT ON hospital.provide TO 'D005'@'localhost';
GRANT SELECT, INSERT ON hospital.provider TO 'D005'@'localhost';
GRANT SELECT, INSERT ON hospital.medication TO 'D005'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_med TO 'D005'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_med TO 'D005'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_detail TO 'D005'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_detail TO 'D005'@'localhost';
GRANT SELECT, INSERT ON hospital.outpatient TO 'D005'@'localhost';
GRANT SELECT, INSERT ON hospital.inpatient TO 'D005'@'localhost';
GRANT SELECT, INSERT ON hospital.patient TO 'D005'@'localhost';
GRANT SELECT ON hospital.employee to 'D005'@'localhost';

-- For N001
GRANT SELECT, INSERT ON hospital.provide TO 'N001'@'localhost';
GRANT SELECT, INSERT ON hospital.provider TO 'N001'@'localhost';
GRANT SELECT, INSERT ON hospital.medication TO 'N001'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_med TO 'N001'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_med TO 'N001'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_detail TO 'N001'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_detail TO 'N001'@'localhost';
GRANT SELECT, INSERT ON hospital.outpatient TO 'N001'@'localhost';
GRANT SELECT, INSERT ON hospital.inpatient TO 'N001'@'localhost';
GRANT SELECT, INSERT ON hospital.patient TO 'N001'@'localhost';
GRANT SELECT ON hospital.employee to 'N001'@'localhost';

-- For N002
GRANT SELECT, INSERT ON hospital.provide TO 'N002'@'localhost';
GRANT SELECT, INSERT ON hospital.provider TO 'N002'@'localhost';
GRANT SELECT, INSERT ON hospital.medication TO 'N002'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_med TO 'N002'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_med TO 'N002'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_detail TO 'N002'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_detail TO 'N002'@'localhost';
GRANT SELECT, INSERT ON hospital.outpatient TO 'N002'@'localhost';
GRANT SELECT, INSERT ON hospital.inpatient TO 'N002'@'localhost';
GRANT SELECT, INSERT ON hospital.patient TO 'N002'@'localhost';
GRANT SELECT ON hospital.employee to 'N002'@'localhost';

-- For N003
GRANT SELECT, INSERT ON hospital.provide TO 'N003'@'localhost';
GRANT SELECT, INSERT ON hospital.provider TO 'N003'@'localhost';
GRANT SELECT, INSERT ON hospital.medication TO 'N003'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_med TO 'N003'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_med TO 'N003'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_detail TO 'N003'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_detail TO 'N003'@'localhost';
GRANT SELECT, INSERT ON hospital.outpatient TO 'N003'@'localhost';
GRANT SELECT, INSERT ON hospital.inpatient TO 'N003'@'localhost';
GRANT SELECT, INSERT ON hospital.patient TO 'N003'@'localhost';
GRANT SELECT ON hospital.employee to 'N003'@'localhost';

-- For N004
GRANT SELECT, INSERT ON hospital.provide TO 'N004'@'localhost';
GRANT SELECT, INSERT ON hospital.provider TO 'N004'@'localhost';
GRANT SELECT, INSERT ON hospital.medication TO 'N004'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_med TO 'N004'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_med TO 'N004'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_detail TO 'N004'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_detail TO 'N004'@'localhost';
GRANT SELECT, INSERT ON hospital.outpatient TO 'N004'@'localhost';
GRANT SELECT, INSERT ON hospital.inpatient TO 'N004'@'localhost';
GRANT SELECT, INSERT ON hospital.patient TO 'N004'@'localhost';
GRANT SELECT ON hospital.employee to 'N004'@'localhost';

-- For N005
GRANT SELECT, INSERT ON hospital.provide TO 'N005'@'localhost';
GRANT SELECT, INSERT ON hospital.provider TO 'N005'@'localhost';
GRANT SELECT, INSERT ON hospital.medication TO 'N005'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_med TO 'N005'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_med TO 'N005'@'localhost';
GRANT SELECT, INSERT ON hospital.examination_detail TO 'N005'@'localhost';
GRANT SELECT, INSERT ON hospital.treatment_detail TO 'N005'@'localhost';
GRANT SELECT, INSERT ON hospital.outpatient TO 'N005'@'localhost';
GRANT SELECT, INSERT ON hospital.inpatient TO 'N005'@'localhost';
GRANT SELECT, INSERT ON hospital.patient TO 'N005'@'localhost';
GRANT SELECT ON hospital.employee to 'N005'@'localhost';

-- SELECT * FROM information_schema.TABLE_PRIVILEGES WHERE GRANTEE LIKE "'N005'@'localhost'";

-- Apply changes
FLUSH PRIVILEGES;

DELIMITER //

CREATE PROCEDURE update_inpatient(
    IN new_Fname VARCHAR(20),
    IN new_Lname VARCHAR(20),
    IN new_phone VARCHAR(20),
    IN new_gender VARCHAR(10),
    IN new_dob DATE,
    IN new_address VARCHAR(150),
    IN new_admission DATE,
    IN new_diagnosis VARCHAR(100),
    IN new_fee DECIMAL(10,2),
    IN new_discharge DATE,
    IN new_sickroom VARCHAR(20),
    IN new_Nurse VARCHAR(20),
	IN ID VARCHAR(20),
    IN Sdate DATE,
    IN Edate DATE,
    IN new_result VARCHAR(100),
    IN Doc VARCHAR(20),
    IN new_Sdate DATE,
    IN new_Edate DATE,
    IN new_Doc VARCHAR(20),
    IN Med_Code INT,
    IN new_Med_Code INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK; -- Rollback transaction on error
    END;

    START TRANSACTION;

    -- Check if patient record exists, if not insert, otherwise update
    IF (SELECT COUNT(*) FROM patient WHERE Patient_Code = ID) = 0 THEN
        INSERT INTO patient (Patient_Code, F_name, L_name, Phone_number, Gender, Dob, Address)
        VALUES (ID, new_Fname, new_Lname, new_phone, new_gender, new_dob, new_address);
    ELSE
        UPDATE patient
        SET F_name = new_Fname, L_name = new_Lname, Phone_number = new_phone, Gender = new_gender, Dob = new_dob, Address = new_address
        WHERE Patient_Code = ID;
    END IF;

    -- Check if inpatient record exists, if not insert, otherwise update
    IF (SELECT COUNT(*) FROM inpatient WHERE IP_Code = ID) = 0 THEN
        INSERT INTO inpatient (IP_Code, `Date of admission`, Diagnosis, Fee, `Date of discharge`, Sickroom, Nurse_Code)
        VALUES (ID, new_admission, new_diagnosis, new_fee, new_discharge, new_sickroom, new_Nurse);
    ELSE
        UPDATE inpatient
        SET `Date of admission` = new_admission, Diagnosis = new_diagnosis, Fee = new_fee, `Date of discharge` = new_discharge, Sickroom = new_sickroom, Nurse_Code = new_Nurse
        WHERE IP_Code = ID;
    END IF;

    -- Check if treatment detail exists, if not insert, otherwise update
    IF (SELECT COUNT(*) FROM treatment_detail 
        WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate) = 0 THEN
		IF (SELECT COUNT(*) FROM treatment_detail 
			WHERE IP_Code = ID AND Doc_Code = new_Doc AND `Start date` = new_Sdate AND `End date` = new_Edate) != 0 
			AND (SELECT COUNT(*) FROM treatment_med 
			WHERE IP_Code = ID AND Doc_Code = new_Doc AND `Start date` = new_Sdate AND `End date` = new_Edate AND Med_Code = new_Med_Code) = 0 THEN 
			INSERT INTO treatment_med (IP_Code, Doc_Code, `Start date`, `End date`, Med_Code)
			VALUES (ID, new_Doc, new_Sdate, new_Edate, new_Med_Code);
        ELSE
			INSERT INTO treatment_detail (IP_Code, Doc_Code, `Start date`, `End date`, Result)
			VALUES (ID, new_Doc, new_Sdate, new_Edate, new_result);
            INSERT INTO treatment_med (IP_Code, Doc_Code, `Start date`, `End date`, Med_Code)
			VALUES (ID, new_Doc, new_Sdate, new_Edate, new_Med_Code);
		END IF;
    ELSE
		IF (SELECT COUNT(*) FROM treatment_detail 
			WHERE IP_Code = ID AND Doc_Code = new_Doc AND `Start date` = new_Sdate AND `End date` = new_Edate) != 0 THEN
			UPDATE treatment_med
			SET Doc_Code = new_Doc, `Start date` = new_Sdate, `End date` = new_Edate, Med_Code = new_Med_Code
			WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate AND Med_Code = treatment_med.Med_Code;
            UPDATE treatment_detail
			SET Result = new_result
			WHERE IP_Code = ID AND Doc_Code = new_Doc AND `Start date` = new_Sdate AND `End date` = new_Edate;
            
			IF (SELECT COUNT(*) FROM treatment_med 
				WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate) = 0 THEN
				DELETE FROM treatment_detail
                WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate;
			END IF;
                
		ELSE
			IF (SELECT COUNT(*) FROM treatment_med 
				WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate) > 1 THEN
				INSERT INTO treatment_detail (IP_Code, Doc_Code, `Start date`, `End date`, Result)
				VALUES (ID, new_Doc, new_Sdate, new_Edate, new_result);
                
                UPDATE treatment_med
				SET Doc_Code = new_Doc, `Start date` = new_Sdate, `End date` = new_Edate, Med_Code = new_Med_Code
				WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate AND Med_Code = treatment_med.Med_Code;
			ELSE
				UPDATE treatment_detail
				SET Doc_Code = new_Doc, `Start date` = new_Sdate, `End date` = new_Edate, Result = new_result
				WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate;
				
				UPDATE treatment_med
				SET Med_Code = new_Med_Code
				WHERE IP_Code = ID AND Doc_Code = new_Doc AND `Start date` = new_Sdate AND `End date` = new_Edate AND Med_Code = treatment_med.Med_Code;
            END IF;
        END IF;
    END IF;

    COMMIT; -- Commit transaction if successful
END //

CREATE PROCEDURE update_outpatient(
    IN new_Fname VARCHAR(20),
    IN new_Lname VARCHAR(20),
    IN new_phone VARCHAR(20),
    IN new_gender VARCHAR(10),
    IN new_dob DATE,
    IN new_address VARCHAR(150),
    IN ID VARCHAR(20),
    IN Doc VARCHAR(20),
    IN Edate DATE,
    IN new_diagnosis VARCHAR(100),
    IN new_fee DECIMAL(10, 2),
    IN Ndate DATE,
    IN new_Doc VARCHAR(20),
    IN new_Edate DATE,
    IN Med_Code INT,
    IN new_Med_Code INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK; -- Rollback transaction on error
    END;

    START TRANSACTION;
    
    -- Check if patient record exists, if not insert, otherwise update
    IF (SELECT COUNT(*) FROM patient WHERE Patient_Code = ID) = 0 THEN
        INSERT INTO patient (Patient_Code, F_name, L_name, Phone_number, Gender, Dob, Address)
        VALUES (ID, new_Fname, new_Lname, new_phone, new_gender, new_dob, new_address);
    ELSE
        UPDATE patient
        SET F_name = new_Fname, L_name = new_Lname, Phone_number = new_phone, Gender = new_gender, Dob = new_dob, Address = new_address
        WHERE Patient_Code = ID;
    END IF;
    
    -- Check if inpatient record exists, if not insert, otherwise update
    IF (SELECT COUNT(*) FROM outpatient WHERE OP_Code = ID) = 0 THEN
        INSERT INTO outpatient (OP_Code)
        VALUES (ID);
    END IF;
    
    -- Check if examination_detail record exists, if not insert, otherwise update
    IF (SELECT COUNT(*) FROM examination_detail 
        WHERE OP_Code = ID AND Doc_Code = Doc AND `Examination date` = Edate) = 0 THEN
		IF (SELECT COUNT(*) FROM examination_detail 
			WHERE OP_Code = ID AND Doc_Code = new_Doc AND `Examination date` = new_Edate) != 0 
			AND (SELECT COUNT(*) FROM examination_med 
			WHERE OP_Code = ID AND Doc_Code = new_Doc AND `Examination date` = new_Edate AND Med_Code = new_Med_Code) = 0 THEN 
			INSERT INTO examination_med (OP_Code, Doc_Code, `Examination date`, Med_Code)
			VALUES (ID, new_Doc, new_Edate, new_Med_Code);
        ELSE
			INSERT INTO examination_detail (OP_Code, Doc_Code, `Examination date`, Diagnosis, Fee, Next_examination)
			VALUES (ID, new_Doc, new_Edate, new_diagnosis, new_fee, Ndate);
            INSERT INTO examination_med (OP_Code, Doc_Code, `Examination date`, Med_Code)
			VALUES (ID, new_Doc, new_Edate, new_Med_Code);
		END IF;
    ELSE
		IF (SELECT COUNT(*) FROM examination_detail 
			WHERE OP_Code = ID AND Doc_Code = new_Doc AND `Examination date` = new_Edate) != 0 THEN
			UPDATE examination_med
			SET Doc_Code = new_Doc, `Examination date` = new_Edate, Med_Code = new_Med_Code
			WHERE OP_Code = ID AND Doc_Code = Doc AND `Examination date` = Edate AND Med_Code = examination_med.Med_Code;
            UPDATE examination_detail
			SET Diagnosis = new_diagnosis, Fee = new_fee, Next_examination = Ndate
			WHERE OP_Code = ID AND Doc_Code = new_Doc AND `Examination date` = new_Edate;
            
			IF (SELECT COUNT(*) FROM examination_med 
				WHERE OP_Code = ID AND Doc_Code = Doc AND `Examination date` = Edate) = 0 THEN
				DELETE FROM examination_detail
                WHERE OP_Code = ID AND Doc_Code = Doc AND `Examination date` = Edate;
			END IF;
                
		ELSE
			IF (SELECT COUNT(*) FROM examination_med 
				WHERE OP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `Examination date` = Edate) > 1 THEN
				INSERT INTO examination_detail (OP_Code, Doc_Code, `Examination date`, Diagnosis, Fee, Next_examination)
				VALUES (ID, new_Doc, new_Edate, new_diagnosis, new_fee, Ndate);
                
                UPDATE examination_med
				SET Doc_Code = new_Doc, `Examination date` = new_Edate, Med_Code = new_Med_Code
				WHERE OP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `Examination date` = Edate AND Med_Code = examination_med.Med_Code;
			ELSE
				UPDATE examination_detail
				SET Doc_Code = new_Doc, `Examination date` = new_Edate, Diagnosis = new_diagnosis, Fee = new_fee, Next_examination = Ndate
				WHERE OP_Code = ID AND Doc_Code = Doc AND `Examination date` = Edate;
				
				UPDATE examination_med
				SET Med_Code = new_Med_Code
				WHERE OP_Code = ID AND Doc_Code = new_Doc AND `Examination date` = new_Edate AND Med_Code = examination_med.Med_Code;
            END IF;
        END IF;
    END IF;

    COMMIT; -- Commit transaction if successful
END //

CREATE PROCEDURE delete_records_inpatient(
	IN ID VARCHAR(20),
    IN Sdate DATE,
    IN Edate DATE,
    IN Doc VARCHAR(20),
    IN Med_Code INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK; -- Rollback transaction on error
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'An error occurred during the deletion.';
    END;

    START TRANSACTION;
    
    IF (SELECT COUNT(*) FROM treatment_med 
		WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate AND Med_Code = treatment_med.Med_Code) > 0 THEN
        DELETE FROM treatment_med
		WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate AND Med_Code = treatment_med.Med_Code;
        
        IF (SELECT COUNT(*) FROM treatment_med 
			WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate AND Med_Code = treatment_med.Med_Code) = 0 THEN
			DELETE FROM treatment_detail
			WHERE IP_Code = ID AND Doc_Code = Doc AND `Start date` = Sdate AND `End date` = Edate;
            
		END IF;
	END IF;
    
COMMIT; -- Commit transaction if successful
END //

CREATE PROCEDURE delete_records_outpatient(
	IN ID VARCHAR(20),
    IN Edate DATE,
    IN Doc VARCHAR(20),
    IN Med_Code INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK; -- Rollback transaction on error
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'An error occurred during the deletion.';
    END;

    START TRANSACTION;
    
    IF (SELECT COUNT(*) FROM examination_med 
		WHERE OP_Code = ID AND Doc_Code = Doc AND `Examination date` = Edate AND Med_Code = examination_med.Med_Code) > 0 THEN
        DELETE FROM examination_med
		WHERE OP_Code = ID AND Doc_Code = Doc AND `Examination date` = Edate AND Med_Code = examination_med.Med_Code;
        
        IF (SELECT COUNT(*) FROM examination_med 
			WHERE OP_Code = ID AND Doc_Code = Doc AND `Examination date` = Edate AND Med_Code = examination_med.Med_Code) = 0 THEN
			DELETE FROM examination_detail
			WHERE OP_Code = ID AND Doc_Code = Doc AND `Examination date` = Edate;
            
		END IF;
	END IF;
    
COMMIT; -- Commit transaction if successful
END //

DELIMITER ;

