SEVERE : Database executeQuery error : org.postgresql.util.PSQLException: Unterminated string literal started at position 14,223 in SQL UPDATE orgs SET org_name = 'Zetort', cert_number = 'C.123456', pin = 'P0123456789J', vat_number = '0123456A', 
default_country_id = 'KE', currency_id = 1, member_limit = 1000,
org_full_name = 'Zetort Sacco',
invoice_footer = 'Make all payments to : Zetot
Thank you for your Business
We Turn your information into profitability'
WHERE org_id = 0;

UPDATE transaction_counters SET document_number = '10001';

UPDATE address SET 
			org_id = 0, sys_country_id = 'KE', table_name ='orgs', table_id = '0, 
			post_office_box= 45689, postal_code= 00100, premises='12th Floor, Barclays Plaza', 
			street='Loita Street', town='Nairobi', phone_number='+254 (20) 2227100/2243097', 
			extension=NULL, mobile='+254 725 819505 or +254 738 819505', fax=NULL, 
			email='accounts@dewcis.com', website='www.dewcis.com', is_default=true, first_password=NULL, details=NULL; 

DELETE FROM currency WHERE currency_id IN (3, 4);
INSERT INTO currency_rates (org_id, currency_id, exchange_rate)
VALUES (0, 2, 100);

INSERT INTO fiscal_years (fiscal_year, org_id, fiscal_year_start, fiscal_year_end) VALUES
('2014', 0, '2014-01-01', '2014-12-31'),
('2015', 0, '2015-01-01', '2015-12-31'),
('2016', 0, '2016-01-01', '2016-12-31'),
('2017', 0, '2017-01-01', '2017-12-31'),
('2018', 0, '2018-01-01', '2018-12-31'),
('2019', 0, '2019-01-01', '2019-12-31');

SELECT add_periods(fiscal_year_id::text, null, null)
FROM fiscal_years
ORDER BY fiscal_year_id;

UPDATE periods SET opened = true WHERE start_date <= current_date;
UPDATE periods SET activated = true WHERE start_date <= current_date;

--------add user admin
INSERT INTO entitys (org_id,use_key_id,entity_type_id,entity_name,user_name,function_role,is_active,first_password) VALUES
(0,0,0, 'Administrator', 'admin', 'admin,manager,operations', true, 'baraza');

---- sacco members import
UPDATE imp_members SET ID_NO = imp_member_id::text WHERE ID_NO = null;
UPDATE imp_members SET ID_NO = imp_member_id::text WHERE trim(ID_NO) = '';
UPDATE imp_members SET ID_NO = imp_member_id::text WHERE imp_member_id IN
(SELECT max(imp_member_id) FROM imp_members
GROUP BY ID_NO
HAVING count(imp_member_id) > 1);

UPDATE imp_members SET DATE_OF_BIRTH = null WHERE trim(DATE_OF_BIRTH) = '';
UPDATE imp_members SET date_of_birth = ('01/01/'||date_of_birth) WHERE date_of_birth LIKE '19%%';
UPDATE imp_members SET date_of_birth = ('10/05/1994') WHERE date_of_birth LIKE '10-0594';
UPDATE imp_members SET REG_DATE = null WHERE trim(REG_DATE) = '';
UPDATE imp_members SET REG_DATE = '01/07/2015' WHERE trim(REG_DATE) = 'Jul-15';
UPDATE imp_members SET REG_DATE = '01/03/2019' WHERE trim(REG_DATE) = 'Mar-19';
UPDATE imp_members SET REG_DATE = '01/09/2017' WHERE trim(REG_DATE) = 'Sep-17';
UPDATE imp_members SET REG_DATE = '01/02/2018' WHERE trim(REG_DATE) = 'Feb-18';
UPDATE imp_members SET REG_DATE = '01/08/2018' WHERE trim(REG_DATE) = 'Aug-18';
UPDATE imp_members SET reg_date = ('01/01/'||reg_date) WHERE reg_date LIKE '20%%';

SELECT pg_catalog.setval('members_member_id_seq', 11, true);
ALTER TABLE members ADD COLUMN member_no  varchar(50);

---IMPORT ALL SACCO MEMBERS
INSERT INTO members (org_id, business_account, branch_id, membership_group_id, person_title,
	sys_member_no, member_name, identification_number, identification_type_id, member_email, telephone_number, town, 
	date_of_birth, gender, nationality, marital_status, entry_date,application_date, approve_status, member_no) 
SELECT 0, 0, 1, 1, 'Miss', 
	Member_ID, MEMBERS_NAME, ID_NO, 1, EMAIL_ADDRESS, PHONE_NO, LOCATION,
	to_date(DATE_OF_BIRTH, 'MM/DD/YYYY'), substr(GENDER, 1, 1), 'KE', 'S', 
	to_date(REG_DATE, 'MM/DD/YYYY'), current_date, 'Completed', member_id
FROM imp_members;

UPDATE members SET person_title = 'Mr' WHERE gender = 'M';

UPDATE members SET approve_status = 'Approved',  action_date = now()
WHERE business_account = 0 AND approve_status = 'Completed';


------------- Import contributions
ALTER TABLE periods ADD p_contrib integer;
UPDATE periods SET p_contrib = 1 WHERE to_char(start_date, 'YYYY') = '2014';
UPDATE periods SET p_contrib = 23 WHERE to_char(start_date, 'YYYY') = '2015';
UPDATE periods SET p_contrib = 45 WHERE to_char(start_date, 'YYYY') = '2016';
UPDATE periods SET p_contrib = 67 WHERE to_char(start_date, 'YYYY') = '2017';
UPDATE periods SET p_contrib = 89 WHERE to_char(start_date, 'YYYY') = '2018';
UPDATE periods SET p_contrib = 111 WHERE to_char(start_date, 'YYYY') = '2019';
UPDATE periods SET p_contrib = p_contrib + EXTRACT(MONTH FROM start_date);


------------- Import Loans
ALTER TABLE periods ADD p_loan integer;
UPDATE periods SET p_loan = 14 WHERE to_char(start_date, 'YYYY') = '2014';
UPDATE periods SET p_loan = 27 WHERE to_char(start_date, 'YYYY') = '2015';
UPDATE periods SET p_loan = 40 WHERE to_char(start_date, 'YYYY') = '2016';
UPDATE periods SET p_loan = 53 WHERE to_char(start_date, 'YYYY') = '2017';
UPDATE periods SET p_loan = 66 WHERE to_char(start_date, 'YYYY') = '2018';
UPDATE periods SET p_loan = 79 WHERE to_char(start_date, 'YYYY') = '2019';
UPDATE periods SET p_loan = p_loan + EXTRACT(MONTH FROM start_date);

UPDATE imp_LOANS SET Loan_request_date = replace(Loan_request_date, '.0', '');

------ Contribution
SELECT ci.MEMBER_NO, ci.MEMBER_NAME, pe.period_id, pe.start_date, 
	contributions[pe.p_contrib]
FROM imp_CONTRIBUTIONS ci, periods pe
ORDER BY ci.MEMBER_NO, pe.period_id;

---- Loan details
ALTER TABLE loans ADD COLUMN imp_loan_id integer;
ALTER TABLE loans ADD COLUMN application_fee real;

UPDATE imp_LOANS SET Loans_info[1] = 66900 WHERE member_no = 4;
UPDATE imp_LOANS SET Loans_info[1] = 70000 WHERE member_no = 5;
UPDATE imp_LOANS SET Loans_info[1] = 70478 WHERE member_no = 8;
UPDATE imp_LOANS SET Loans_info[1] = 205988 WHERE member_no = 19;
UPDATE imp_LOANS SET Loans_info[1] = 45000 WHERE member_no = 31;

SELECT li.Member_NO, li.MEMBERS_NAME, li.Loan_request_date,
('1900-01-01'::date + li.Loan_request_date::int) AS loan_request_date_r,
(li.Loans_info[1]) AS principle_amount, (li.Loans_info[2]) AS application_fee, (li.Loans_info[3]) AS disbursed_amount, 
(li.Loans_info[4]) AS interest,(li.Loans_info[5]) AS fines, (li.Loans_info[6]) AS principle_plus_interest,
(li.Loans_info[7]) AS payment_cash_deposit, (li.Loans_info[8]) AS payments_from_savings,
(li.Loans_info[9]) AS payment_by_guarantor, (li.Loans_info[10]) AS fines_paid_in_cash, 
(li.Loans_info[11]) AS fines_to_saving_account, (li.Loans_info[12]) AS fines_by_guarantor,
(li.Loans_info[13]) AS payment_through_other, (li.Loans_info[14]) AS loan_balance

FROM imp_LOANS li
WHERE li.Member_NO >0
ORDER BY li.MEMBER_NO;

---- Loan repayments
SELECT li.Member_NO, li.MEMBERS_NAME, li.Loan_request_date,
pe.period_id, pe.start_date, li.Loans_info[pe.p_loan]
FROM imp_LOANS li, periods pe
WHERE li.Loans_info[pe.p_loan] > 0
ORDER BY li.MEMBER_NO, pe.period_id;

------======================= DATA IMPORT BEGIN ===============

CREATE TABLE zetort_contrib (
	z_contrib_id 			serial primary key,
	member_no 				varchar(50),
	member_name 			varchar(150),
	period_id 				integer,
	start_date 				date,
	contribution 			real
);
INSERT INTO zetort_contrib (member_no,member_name,period_id,start_date,contribution)
SELECT ci.MEMBER_NO, ci.MEMBER_NAME, pe.period_id, pe.start_date, 
	contributions[pe.p_contrib]
FROM imp_CONTRIBUTIONS ci, periods pe
ORDER BY ci.MEMBER_NO, pe.period_id; 

---- account activity triggers remove auto period addition
CREATE OR REPLACE FUNCTION ins_account_activity() RETURNS trigger AS $$
DECLARE
	v_deposit_account_id		integer;
	v_period_id					integer;
	v_loan_id					integer;
	v_activity_type_id			integer;
	v_use_key_id				integer;
	v_org_currency_id			integer;
	v_account_currency_id		integer;
	v_transfer_currency_id		integer;
	v_minimum_balance			real;
	v_account_transfer			varchar(32);
	v_first_trx					boolean;
BEGIN

	IF((NEW.account_credit = 0) AND (NEW.account_debit = 0))THEN
		RAISE EXCEPTION 'You must enter a debit or credit amount';
	ELSIF((NEW.account_credit < 0) OR (NEW.account_debit < 0))THEN
		RAISE EXCEPTION 'The amounts must be positive';
	ELSIF((NEW.account_credit > 0) AND (NEW.account_debit > 0))THEN
		RAISE EXCEPTION 'Both debit and credit cannot not have an amount at the same time';
	END IF;
	
	SELECT use_key_id INTO v_use_key_id
	FROM activity_types WHERE (activity_type_id = NEW.activity_type_id);
	
	IF(NEW.deposit_account_id is not null)THEN
		SELECT orgs.currency_id, products.currency_id, COALESCE(deposit_accounts.minimum_balance, 0)
			INTO v_org_currency_id, v_account_currency_id, v_minimum_balance
		FROM deposit_accounts INNER JOIN products ON deposit_accounts.product_id = products.product_id
			INNER JOIN orgs ON deposit_accounts.org_id = orgs.org_id
		WHERE (deposit_accounts.deposit_account_id = NEW.deposit_account_id);
	ELSIF(NEW.loan_id is not null)THEN
		SELECT orgs.currency_id, products.currency_id, null
			INTO v_org_currency_id, v_account_currency_id, v_minimum_balance
		FROM loans INNER JOIN products ON loans.product_id = products.product_id
			INNER JOIN orgs ON loans.org_id = orgs.org_id
		WHERE (loans.loan_id = NEW.loan_id);
	END IF;
	
	v_first_trx := false;
	IF(NEW.link_activity_id is null)THEN
		v_first_trx := true;
		NEW.link_activity_id := nextval('link_activity_id_seq');
	END IF;
	
	IF(NEW.transfer_link_id is not null)THEN
		SELECT account_number INTO NEW.transfer_account_no
		FROM deposit_accounts WHERE (deposit_account_id = NEW.transfer_link_id);
		NEW.activity_date := current_date;
		NEW.value_date := current_date;
		IF(NEW.transfer_account_no is null)THEN
			RAISE EXCEPTION 'Enter the correct transfer account';
		END IF;
	END IF;
	
	IF(TG_OP = 'INSERT')THEN
		IF(NEW.deposit_account_id is not null)THEN
			SELECT sum(account_credit - account_debit) INTO NEW.balance
			FROM account_activity
			WHERE (account_activity_id < NEW.account_activity_id)
				AND (deposit_account_id = NEW.deposit_account_id);
		END IF;
		IF(NEW.loan_id is not null)THEN
			SELECT sum(account_credit - account_debit) INTO NEW.balance
			FROM account_activity
			WHERE (account_activity_id < NEW.account_activity_id)
				AND (loan_id = NEW.loan_id);
		END IF;
		IF(NEW.balance is null)THEN
			NEW.balance := 0;
		END IF;
		NEW.balance := NEW.balance + (NEW.account_credit - NEW.account_debit);
				
		-- IF(v_use_key_id IN (102, 104, 107))THEN			
		-- 	IF((NEW.balance < v_minimum_balance) AND (NEW.activity_status_id = 1))THEN
		-- 			RAISE EXCEPTION 'You cannot withdraw below allowed minimum balance';
		-- 	END IF;
		-- END IF;
	END IF;
	
	IF((NEW.transfer_account_no is null) AND (NEW.transfer_account_id is null) AND (NEW.transfer_loan_id is null))THEN
		SELECT vw_account_definations.account_number INTO NEW.transfer_account_no
		FROM vw_account_definations INNER JOIN deposit_accounts ON vw_account_definations.product_id = deposit_accounts.product_id
		WHERE (deposit_accounts.deposit_account_id = NEW.deposit_account_id) 
			AND (vw_account_definations.activity_type_id = NEW.activity_type_id) 
			AND (vw_account_definations.use_key_id IN (101, 102));
	END IF;

	IF(NEW.transfer_account_no is not null)THEN
		SELECT deposit_accounts.deposit_account_id, products.currency_id INTO v_deposit_account_id, v_transfer_currency_id
		FROM deposit_accounts INNER JOIN products ON deposit_accounts.product_id = products.product_id
		WHERE (deposit_accounts.account_number = NEW.transfer_account_no);
		
		IF(v_deposit_account_id is null)THEN
			SELECT loans.loan_id, products.currency_id INTO v_loan_id, v_transfer_currency_id
			FROM loans INNER JOIN products ON loans.product_id = products.product_id
			WHERE (loans.account_number = NEW.transfer_account_no);
		END IF;
		
		IF((v_deposit_account_id is null) AND (v_loan_id is null))THEN
			RAISE EXCEPTION 'Enter a valid account to do transfer';
		ELSIF((v_deposit_account_id is not null) AND (NEW.deposit_account_id = v_deposit_account_id))THEN
			RAISE EXCEPTION 'You cannot do a transfer on same account';
		ELSIF((v_loan_id is not null) AND (NEW.loan_id = v_loan_id))THEN
			RAISE EXCEPTION 'You cannot do a transfer on same account';
		ELSIF((v_account_currency_id != v_transfer_currency_id) AND (v_use_key_id != 250))THEN
			RAISE EXCEPTION 'You cannot do a transfer on different currency accounts';
		ELSIF(v_deposit_account_id is not null)THEN
			NEW.transfer_account_id := v_deposit_account_id;
		ELSIF(v_loan_id is not null)THEN
			NEW.transfer_loan_id := v_loan_id;
		END IF;
	ELSIF(NEW.transfer_account_id is not null)THEN
		SELECT account_number INTO NEW.transfer_account_no
		FROM deposit_accounts WHERE (deposit_account_id = NEW.transfer_account_id);
	ELSIF(NEW.transfer_loan_id is not null)THEN
		SELECT account_number INTO NEW.transfer_account_no
		FROM loans WHERE (loan_id = NEW.transfer_loan_id);
	END IF;
	
	---- geting the exchange rate
	IF(v_org_currency_id = v_account_currency_id)THEN
		NEW.exchange_rate := 1;
	ELSE
		IF(v_use_key_id = 250)THEN
			IF(v_first_trx = true)THEN
				IF(NEW.invert_rate = true)THEN NEW.exchange_rate := NEW.trading_rate;
				ELSE NEW.exchange_rate := 1 / NEW.trading_rate; END IF;
			END IF;
		ELSE
			NEW.exchange_rate := get_currency_rate(NEW.org_id, v_account_currency_id);
		END IF;
	END IF;
			
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

---add all contributions to transaction accounts
INSERT INTO account_activity (period_id,activity_date, value_date, deposit_account_id, account_credit, activity_type_id, activity_frequency_id, 
activity_status_id, entity_id, org_id)
SELECT zc.period_id,zc.start_date,zc.start_date,cdd.deposit_account_id,zc.contribution,2,1,1,0,0
FROM (SELECT mm.member_no,mm.member_id,da.deposit_account_id 
	FROM members mm 
	INNER JOIN deposit_accounts da ON da.member_id = mm.member_id
	WHERE da.product_id = 1)cdd 
INNER JOIN zetort_contrib zc ON cdd.member_no = zc.member_no
WHERE zc.contribution >0;

---add members contribution from members transaction account

INSERT INTO account_activity(org_id,activity_type_id,activity_status_id,entity_id,activity_frequency_id,
deposit_account_id, transfer_account_no,activity_date,value_date,account_debit,exchange_rate,period_id,details) 
SELECT 0,28,1,0,1,cdd.deposit_account_id,cmca.account_number,(zc.start_date + 2)AS activity_date,(zc.start_date + 2)AS value_date,
 zc.contribution,1,zc.period_id, 'Contributions' 
FROM zetort_contrib zc
INNER JOIN(SELECT mm.member_no,mm.member_id,da.deposit_account_id, da.account_number
	FROM members mm 
	INNER JOIN deposit_accounts da ON da.member_id = mm.member_id
	WHERE da.product_id = 1)cdd ON cdd.member_no = zc.member_no
INNER JOIN (SELECT mm.member_no,mm.member_id,da.deposit_account_id, da.account_number 
	FROM members mm 
	INNER JOIN deposit_accounts da ON da.member_id = mm.member_id
	WHERE da.product_id = 2)cmca ON cmca.member_no = zc.member_no
WHERE zc.contribution >0;



. Expected  char