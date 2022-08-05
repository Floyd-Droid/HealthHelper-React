-- Set up HealthHelper database

DROP TABLE IF EXISTS food_index cascade;
DROP TABLE IF EXISTS food_index_macro cascade;
DROP TABLE IF EXISTS cost cascade;
DROP TABLE IF EXISTS logs cascade;

CREATE TABLE food_index(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR (50),
  name VARCHAR (255) NOT NULL,
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  serving_by_weight FLOAT (2),
  weight_unit VARCHAR (10) CHECK (weight_unit in ('g', 'mg', 'kg', 'lbs', 'oz')),
  serving_by_volume FLOAT (2),
  volume_unit VARCHAR (10) CHECK (volume_unit in ('tbsp', 'tsp', 'cups', 'gal', 'pt', 'qt', 'L', 'mL')),
  serving_by_item FLOAT (2)
);

CREATE TABLE food_index_macro(
  id INT,
  calories INT CHECK (calories >= 0),
  total_fat FLOAT (1) CHECK (total_fat >= 0),
  sat_fat FLOAT (1) CHECK (sat_fat >= 0),
  trans_fat FLOAT (1) CHECK (trans_fat >= 0),
  poly_fat FLOAT (1) CHECK (poly_fat >= 0),
  mono_fat FLOAT (1) CHECK (mono_fat >= 0),
  cholesterol INT CHECK (cholesterol >= 0),
  sodium INT CHECK (sodium >= 0),
  total_carbs FLOAT (1) CHECK (total_carbs >= 0),
  total_fiber FLOAT (1) CHECK (total_fiber >= 0),
  sol_fiber FLOAT (1) CHECK (sol_fiber >= 0),
  insol_fiber FLOAT (1) CHECK (insol_fiber >= 0),
  total_sugars FLOAT (1) CHECK (total_sugars >= 0),
  added_sugars FLOAT (1) CHECK (added_sugars >= 0),
  protein FLOAT (1) CHECK (protein >= 0),
  CONSTRAINT fk_index_id
    FOREIGN KEY(id)
      REFERENCES food_index(id)
        ON DELETE CASCADE
);

CREATE TABLE cost(
  id INT,
  cost_per_container FLOAT (2) CHECK (cost_per_container >= 0),
  servings_per_container FLOAT (2) CHECK (servings_per_container >= 0),
  CONSTRAINT fk_index_id
    FOREIGN KEY(id)
      REFERENCES food_index(id)
        ON DELETE CASCADE
);

CREATE TABLE logs(
  id SERIAL PRIMARY KEY,
  index_id INT,
  user_id VARCHAR(255),
  timestamp_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount FLOAT (2) CHECK (amount >= 0),
  amount_unit VARCHAR(10) CHECK (amount_unit in ('g', 'mg', 'kg', 'lbs', 'oz', 
    'tbsp', 'tsp', 'cups', 'gal', 'pt', 'qt', 'L', 'mL', 'items', 'servings')),
  CONSTRAINT fk_index_id
    FOREIGN KEY (index_id)
      REFERENCES food_index(id) 
        ON DELETE CASCADE
);
