-- 1. Insert the following new record to the account table
-- Tony, Stark, tony@starkent.com, Iam1ronM@n
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- 2. Modify the Tony Stark record to change the account_type to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- 3. Delete the Tony Stark record from the database
DELETE FROM public.account
WHERE account_id = 1;
-- 4. Modify the "GM Hummer" record to read "a huge interior" rather than "small
-- interiors" using a single query. Explore the PostgreSQL Replace function Do
-- NOT retype the entire description as part of the query.. It needs to be part of
-- an Update query as shown in the code examples of this SQL Reading
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- 5. Use an inner join to select the make and model fields from the inventory table
-- and the classification name field from the classification table for inventory
-- items that belong to the "Sport" category. These resources may help you:
-- https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/. Two
-- records should be returned as a result of the query.
SELECT inv_make AS "Make",
    inv_model AS "Model",
    classification_name as "Classification"
FROM public.inventory i
    JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- 6. Update all records in the inventory table to add "/vehicles"
-- to the middle of the file path in the inv_image and
-- inv_thumbnail columns using a single query. This reference
-- may prove helpful - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-replace/. 
-- When done the path for both inv_image and inv_thumbnail should resemble this
-- example: /images/vehicles/a-car-name.jpg
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');