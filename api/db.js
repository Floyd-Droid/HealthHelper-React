import 'dotenv/config';
import pg from 'pg';

const isProduction = process.env.NODE_ENV === 'production' ? true : false;

const connectionString = `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE}`;

export const pool = new pg.Pool({
	connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
	...(isProduction && 
		{ssl: 
			{
				rejectUnauthorized: false
			}
		}
	),
});
