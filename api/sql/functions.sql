-- Give new users a baseline set of entries

CREATE OR REPLACE FUNCTION insertBaseEntries(new_user_id varchar) RETURNS void AS
$BODY$
BEGIN

	-- apples
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_item) VALUES 
		(new_user_id, 'apple', 182, 'g', 1);

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='apple' and user_id=new_user_id), 95, 0.3, 0.1, 0, null, null, 0, 0, 25, 4.4, null, null, 19, 0, 0.5);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='apple' and user_id=new_user_id), null, null);

	-- bananas
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_item) VALUES 
		(new_user_id, 'banana', 140, 'g', 1);

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='banana' and user_id=new_user_id), 121, 0.4, 0.2, 0, null, null, 0, 0, 31, 3.5, null, null, 17, 0, 1.5);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='banana' and user_id=new_user_id), null, null);
	
	-- navels
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_item) VALUES 
		(new_user_id, 'navels', 150, 'g', 1);

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='navels' and user_id=new_user_id), 73, 0.2, 0.1, 0, 0.1, 0.1, 0, 0, 19, 3, null, null, 13, 0, 1);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='navels' and user_id=new_user_id), null, null);
	
	-- mangoes
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'mango', 165, 'g', 1, 'cups');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='mango' and user_id=new_user_id), 107, 0.5, 0, 0, null, null, 0, 0, 32, 5, null, null, 24, 0, 1);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='mango' and user_id=new_user_id), null, null);

	-- strawberries
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'strawberries', 100, 'g', 0.5, 'cups');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='strawberries' and user_id=new_user_id), 35, 0.2, 0, 0, null, null, 0, 0, 7.5, 1.8, null, null, 5, 0, 0.5);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='strawberries' and user_id=new_user_id), null, null);

	-- blueberries
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit) VALUES 
		(new_user_id, 'blueberries', 150, 'g');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='blueberries' and user_id=new_user_id), 80, 0.5, 0, 0, null, null, 0, 0, 21, 4, null, null, 15, 0, 1);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='blueberries' and user_id=new_user_id), null, null);
	
	-- broccoli
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'broccoli', 90, 'g', 1, 'cups');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='broccoli' and user_id=new_user_id), 30, 0.3, 0, 0, null, null, 0, 30, 6, 2.5, null, null, 1.5, 0, 2.5);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='broccoli' and user_id=new_user_id), null, null);
	
	-- carrots
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit) VALUES 
		(new_user_id, 'carrots', 100, 'g');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='carrots' and user_id=new_user_id), 100, 0.2, 0, 0, null, null, 0, 70, 10, 2.8, null, null, 5, 0, 1);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='carrots' and user_id=new_user_id), null, null);

	-- spinach
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'spinach', 85, 'g', 3, 'cups');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='spinach' and user_id=new_user_id), 20, 0, 0, 0, null, null, 0, 0, 3, 2, null, null, 0, 0, 2);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='spinach' and user_id=new_user_id), null, null);

		-- lettuce (romaine)
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit) VALUES 
		(new_user_id, 'lettuce (romaine)', 85, 'g');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='lettuce (romaine)' and user_id=new_user_id), 15, 0.3, 0, 0, null, null, 0, 0, 2.8, 1.8, null, null, 1, 0, 1);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='lettuce (romaine)' and user_id=new_user_id), null, null);
	
	-- wheat bread 
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_item) VALUES 
		(new_user_id, 'bread (wheat)', 34, 'g', 1);

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='bread (wheat)' and user_id=new_user_id), 90, 1, 0, 0, null, null, 0, 200, 18, 2, null, null, 2, 2, 3);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='bread (wheat)' and user_id=new_user_id), null, null);
	
	-- oats
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'oats', 40, 'g', 0.5, 'cups');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='oats' and user_id=new_user_id), 150, 2.5, 0, 0, 1, 1, 0, 0, 27, 4, 2, 2, 1, 0, 5);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='oats' and user_id=new_user_id), null, null);

	-- pinto beans
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'beans (pinto)', 35, 'g', 0.25, 'cups');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='beans (pinto)' and user_id=new_user_id), 120, 0, 0, 0, 0, 0, 0, 0, 22, 5, null, null, 1, 0, 7);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='beans (pinto)' and user_id=new_user_id), null, null);
	
	-- spaghetti (whole grain)
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit) VALUES 
		(new_user_id, 'spaghetti (whole grain)', 2, 'oz');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='spaghetti (whole grain)' and user_id=new_user_id), 180, 1.5, 0, 0, 0, 0, 0, 0, 40, 6, null, null, 2, 0, 7);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='spaghetti (whole grain)' and user_id=new_user_id), null, null);
	
	-- eggs
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_item) VALUES 
		(new_user_id, 'eggs', 50, 'g', 1);

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='eggs' and user_id=new_user_id), 70, 5, 1.5, 0, null, null, 185, 70, 0, 0, 0, 0, 0, 0, 6);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='eggs' and user_id=new_user_id), null, null);
	
	-- almonds
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'almonds', 30, 'g', 0.25, 'cups');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='almonds' and user_id=new_user_id), 180, 15, 1, 0, null, null, 0, 0, 6, 3, null, null, 1, 0, 6);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='almonds' and user_id=new_user_id), null, null);
	
	-- olive oil
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'olive oil', 15, 'g', 1, 'tbsp');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='olive oil' and user_id=new_user_id), 120, 14, 2, 0, 1.5, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='olive oil' and user_id=new_user_id), null, null);
	
	-- butter
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'butter', 15, 'g', 1, 'tbsp');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='butter' and user_id=new_user_id), 102, 12, 7, 0.5, null, null, 31, 0, 0, 0, 0, 0, 0, 0, 0);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='butter' and user_id=new_user_id), null, null);
	
	-- peanut butter
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'peanut butter', 32, 'g', 2, 'tbsp');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='peanut butter' and user_id=new_user_id), 180, 16, 2, 0, 5, 8, 0, 0, 5, 3, null, null, 2, 0, 8);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='peanut butter' and user_id=new_user_id), null, null);
	
	-- honey
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'honey', 21, 'g', 1, 'tbsp');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='honey' and user_id=new_user_id), 60, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 17, 0, 0);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='honey' and user_id=new_user_id), null, null);
	
		-- parmesan cheese
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit, serving_by_volume, volume_unit) VALUES 
		(new_user_id, 'cheese (parmesan)', 5, 'g', 1, 'tbsp');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='cheese (parmesan)' and user_id=new_user_id), 22, 1.4, 0.9, 0, null, null, 4, 76, 0.2, 0, 0, 0, 0, 0, 1.9);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='cheese (parmesan)' and user_id=new_user_id), null, null);
	
		-- feta cheese
	INSERT INTO food_index (user_id, name, serving_by_weight, weight_unit) VALUES 
		(new_user_id, 'cheese (feta)', 28, 'g');

	INSERT INTO food_index_macro VALUES 
		((SELECT id FROM food_index WHERE name='cheese (feta)' and user_id=new_user_id), 75, 6, 4.2, 0, null, null, 25, 300, 1.2, 0, 0, 0, 1.2, 0, 4);

	INSERT INTO cost VALUES 
		((SELECT id FROM food_index WHERE name='cheese (feta)' and user_id=new_user_id), null, null);

	
END;
$BODY$
	LANGUAGE plpgsql;
