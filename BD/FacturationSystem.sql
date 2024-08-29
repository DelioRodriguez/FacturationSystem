
create database facturationSystem;
use facturationSystem;

CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(50) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Role NVARCHAR(50) CHECK (Role IN ('admin', 'empleado'))
);

CREATE TABLE Products(
	Id int primary key identity(1,1),
	Name varchar(50) not null,
	Price decimal(10,2) not null,
	Amount int not null
);